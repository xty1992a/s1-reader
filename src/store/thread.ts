import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import type { forum } from "@/types";
import * as api from "@/api";
import { storage } from "@/utils";
import sortBy from 'lodash/sortBy'
import {useSystem} from './system'

interface Thread {
  fid: string;
  setFid: (fid: string) => void;
  next: () => Promise<forum.ThreadItem[]>;
  list: forum.ThreadItem[];
}

const enum LoadState {
  unfill = 0,
  pending,
  fail,
  fill,
}

interface Cache {
  id: string;
  list: forum.ThreadItem[];
  state: LoadState;
  query: {
    page: number;
  };
}

type ReadCache = {date: number, thread: forum.ThreadItem}

function ensureMapCount(map: Map<string, {date: number}>, count: number) {
  if (map.size <= count) return map
  const all = sortBy(Array.from(map.entries()), ([_,a]) => 1 - a.date)
  const dels = all.splice(count, map.size - count)
  dels.forEach(([k, v]) => {
    // @ts-ignore
    console.log('移除', v?.thread?.subject!)
    map.delete(k)
  })
  return map
}

export const useThread = defineStore("thread", {
  state: () => ({
    fid: "",
    threadMap: new Map<string, Cache>(),
    readmap: new Map<string, ReadCache>(),
    forumList: [{ name: "VTB虚拟偶像", fid: "151" }] as forum.ForumOption[],
  }),
  actions: {
    setFid(fid: string) {
      this.fid = fid;
      if (!this.threadMap.get(fid)) {
        this.reset(fid);
      }
    },
    setForum(list: forum.ForumOption[]) {
      this.forumList = list;
      storage.set("forumlist", list);
    },
    addForum(option: forum.ForumOption) {
      this.setForum([...this.forumList, option]);
    },
    delForum(option: forum.ForumOption) {
      this.setForum(this.forumList.filter((it) => it.fid !== option.fid));
    },
    swapForum(source: number, target: number) {
      const list = [...this.forumList];
      let temp = list.splice(source, 1);
      let start = list.splice(0, target);
      this.setForum([...start, ...temp, ...list]);
    },
    stepForum(option: forum.ForumOption, delta: number) {
      const index = this.forumList.findIndex((it) => it.fid === option.fid);
      if (index < 0) return;
      const target = index + delta;
      if (target < 0 || target > this.forumList.length - 1) return;
      this.swapForum(index, target);
    },

    async next() {
      const current = this.threadMap.get(this.fid);
      if (!current) return console.log("no current");
      if (current.state === LoadState.fill) return current.state;
      if (current.state === LoadState.pending) return current.state;
      current.state = LoadState.pending;
      const res = await api.getThreadList({
        ...this.query,
        fid: this.fid,
        size: 15,
      });
      if (res.success) {
        const list = [...this.list, ...res.data.Variables.forum_threadlist];
        this.threadMap.set(this.fid, {
          query: {
            ...this.query,
            page: this.query.page + 1,
          },
          state: LoadState.unfill,
          list,
        });
      } else {
        current.state = LoadState.fail;
      }
      return current.state;
    },

    reset(fid: string) {
      this.threadMap.set(fid, {
        list: [],
        state: LoadState.unfill,
        query: {
          page: 1,
        },
        id: fid,
      });
    },

    read(tid: string) {
      const system = useSystem()
      const item = this.list.find((it) => it.tid === tid);
      if (!item) return console.log("no item", tid);
      console.log("now thread replies", item.replies);
      const read: ReadCache = this.readmap.get(tid) || {thread: item};
      read.thread.replies = item.replies;
      read.date = Date.now()
      this.readmap.set(tid, read);
      ensureMapCount(this.readmap, system.config.readCount)
      this.save();
    },

    save() {
      storage.set("readmap.v2", this.readmap);
    },
    restore() {
      const map = storage.get("readmap.v2");
      const forumList = storage.get("forumlist");
      if (map) {
        this.readmap = map;
      }
      if (forumList) {
        this.forumList = forumList;
      }
    },
  },
  getters: {
    list: (state) =>
      (state.threadMap.get(state.fid)?.list ?? []).map((item) => {
        const thread = state.readmap.get(item.tid)?.thread;
        return {
          ...item,
          read: Boolean(thread),
          newreplies: thread ? Number(item.replies) - Number(thread.replies) : 0,
        };
      }),
    query: (state) => state.threadMap.get(state.fid)?.query ?? { page: 1 },
    readList: state => {
      const system = useSystem()
      const list = Array.from(state.readmap.values())
      return sortBy(list, a => 1 - a.date).slice(0, system.config.readCount)
    }
  },
});
