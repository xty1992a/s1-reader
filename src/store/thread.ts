import Taro from '@tarojs/taro'
import {defineStore} from "pinia";
import type {forum} from '@/types'
import * as api from '@/api'
import {storage} from "@/utils";

interface Thread {
  fid: string
  setFid: (fid: string) => void
  next: () => Promise<forum.ThreadItem[]>
  list: forum.ThreadItem[]
}

const enum LoadState {
  unfill=0,
  pending,
  fail,
  fill
}

interface Cache {
  id: string
  list: forum.ThreadItem[]
  state: LoadState
  query: {
    page: number
  }
}

export const useThread = defineStore('thread', {
  state: () => ({
    fid: '',
    threadMap: new Map<string, Cache>(),
    readmap: new Map<string, {replies: number}>()
  }),
  actions: {
    setFid(fid: string) {
      this.fid = fid
      if (!this.threadMap.get(fid)) {
        this.reset(fid)
      }
    },
    async next() {
      const current = this.threadMap.get(this.fid)
      if (!current) return console.log('no current')
      if (current.state === LoadState.fill) return current.state
      if (current.state === LoadState.pending) return current.state
      current.state = LoadState.pending
      const res = await api.getThreadList({...this.query, fid: this.fid, size: 15})
      if (res.success) {
        const list = [...this.list, ...res.data.Variables.forum_threadlist]
        this.threadMap.set(this.fid, {
          query: {
            ...this.query,
            page: this.query.page+1
          },
          state: LoadState.unfill,
          list
        })
      } else {
        current.state = LoadState.fail
      }
      return current.state
    },

    reset(fid: string) {
      this.threadMap.set(fid, {
        list: [],
        state: LoadState.unfill,
        query: {
          page: 1,
        },
        id: fid
      })
    },

    read(tid: string) {
      const item = this.list.find(it => it.tid === tid)
      if (!item) return console.log('no item', tid)
      console.log('now thread replies', item.replies)
      const read = this.readmap.get(tid) || {
        replies: item.replies
      }
      read.replies = item.replies
      this.readmap.set(tid, read)
      this.save()
    },
    save() {
      storage.set('readmap', this.readmap)
    },
    restore() {
      const map = storage.get('readmap')
      if (!map) return
      this.readmap = map
    }
  },
  getters: {
    list: state => (state.threadMap.get(state.fid)?.list ?? []).map(item => {
      const read = state.readmap.get(item.tid)
      return {...item, read: Boolean(read), newreplies: read ? (Number(item.replies) - Number(read.replies)) : 0}
    }),
    query: state => state.threadMap.get(state.fid)?.query ?? {page: 1}
  }
})
