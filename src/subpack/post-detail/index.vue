<template>
  <IPage>
    <view class="post-detail">
      <view class="track">
        <view v-if="message" class="message">
          <view>{{ message }}</view>
        </view>

        <view class="card" v-for="it in state.comments" :key="it.pid">
          <ICard :data="it" />
        </view>
      </view>
      <view class="bottom-holder"/>
    </view>
    <div class="footer safe-area-inset-bottom">
      <IStepper v-model:current="page" v-model:size="size" :total="total" >
        <template #right>
          <nut-icon class="favorite" name="star" @click="addFavorite"/>
        </template>

      </IStepper>
    </div>
    <view class="push-up"  :id="pushToken"/>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PostDetail",
};
</script>

<script setup lang="ts">
//# region 引用、类型
import {
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
} from "vue";
import { getParams, routeToHome } from "@/utils";
import {useSystem} from '@/store'
import {
  usePullDownRefresh,
} from "@tarojs/taro";
import * as api from "@/api";
import type { forum } from "@/types";
import Taro from "@tarojs/taro";
import { storage, sleep } from "@/utils";
import uniqBy from "lodash/uniqBy";
import IStepper from "./IStepper.vue";
import ICard from "./ICard.vue";
import { useScrollEnd } from "@/utils/hooks/useScrollEnd";
import {addFavoriteThread} from "@/api";
import {usePushUp} from "@/utils/hooks/usePushUp";

interface State {
  comments: forum.PostItem[];
  thread: forum.ThreadDetail | null;
  message: forum.Message | null;
  formhash: string
  query: {
    tid: string;
    page: number;
    size: number;
  };
  done: boolean;
  loading: boolean;
}

//# endregion

//# region 数据、状态
const system = useSystem()
const dftQuery = {
  tid: "",
  page: 1,
  size: 30,
};
let pulldown = false;
let scrollTop = 0;
let restore = function () {};

// 状态
const state = reactive<State>({
  comments: [],
  formhash: '',
  query: dftQuery,
  loading: false,
  done: false,
  message: null,
  thread: null,
});

// 衍生计算属性
const message = computed(() => {
  if (state.comments.length) return "";
  return state.message?.messagestr ?? "";
});
const commentsLength = computed(() => state.comments.length)
const query = computed(() => state.query);
const total = computed(() => Number(state.thread?.replies) ?? 0);
const pages = computed(() => Math.ceil(total.value / query.value.size))
const page = computed({
  get: () => state.query.page,
  set: (v) => {
    backTop();
    state.query = { ...state.query, page: v };
  },
});
const size = computed({
  get: () => state.query.size,
  set: (v) => {
    state.query = { ...state.query, size: v };
  },
});

//# endregion

//# region 加载逻辑

const fetchData = async (delay = 0, concat = true) => {
  state.loading = true;
  const res = await api.getPostDetail(state.query, !state.comments.length);
  await sleep(delay);
  state.loading = false;
  if (!res.success) return;
  if (!state.thread) {
    await Taro.setNavigationBarTitle({
      title: res.data.Variables.thread.subject,
    });
  }
  if (res.data.Message) {
    state.message = res.data.Message;
  }
  state.formhash = res.data?.Variables?.formhash ?? ''
  const list = [
    ...(concat ? state.comments : []),
    ...res.data.Variables.postlist,
  ];
  state.comments = uniqBy(list, "pid");
  state.thread = res.data.Variables.thread;
  state.done =
    Number(res.data.Variables.thread.replies) + 1 === state.comments.length;

  if (pulldown) {
    pulldown = false;
    Taro.stopPullDownRefresh();
  }
  restore && restore();
};
//# endregion

//# region 回调（命令）

const addFavorite = async () => {
  if (!state.thread?.tid) return console.log('no tid')
  if (!state.formhash) return console.log('no fromhash');
  const {tid} = state.thread
  const res = await addFavoriteThread({tid, formhash: state.formhash})
  if (!res.success) return
  Taro.showToast({title: res.message})
}
const backTop = () => {
  return Taro.pageScrollTo({ scrollTop: 0, duration: 0 });
};

const reset = ({ tid = "", page = 1 }) => {
  state.comments = [];
  state.query = { ...dftQuery, tid: tid || state.query.tid, page };
  state.thread = null;
  state.done = false;
};

const next = () => {
  page.value += 1;
};

/**
 * 当前阅读快照，页码、页数、高度、
 * */
const snapshot = () => {
  const readsnap = {
    query: query.value,
    scrollTop,
  };
  storage.set(`readsnap:${query.value.tid}`, readsnap);
};

/**
 * 恢复快照
 * */
const remember = (tid: string) => {
  const key = `readsnap:${tid}`;
  const readsnap = storage.get(key);
  if (!readsnap) return;
  state.query = readsnap.query;
  restore = async function () {
    restore = () => {};
    await sleep(50);
    await Taro.pageScrollTo({
      scrollTop: readsnap.scrollTop || 0,
      duration: 0,
    });
  };
};
//# endregion

watch(query, () => {
  fetchData(0, false);
});

//# region 生命周期、事件
/*
useReachBottom(() => {
  if (state.done) return console.log('done');
  next()
});
*/

// 初始化
onMounted(() => {
  scrollTop = 0;
  const params = getParams();
  if (!params.tid) {
    Taro.showToast({ title: "缺少必要参数！", icon: "none" });
    routeToHome();
    return;
  }
  reset({ tid: params.tid });
  remember(params.tid);
});

//# region 上一页、下一页、刷新
// 上拉，下一页
const [pushToken, enablePushUp] = usePushUp(() => {
  if (!system.config.usePushNext) return // 这个功能不是很稳，给个开关控制
  console.log('列表数量', )
  if (pages.value > page.value) { // 非最后一页，就下一页
    page.value++
    return;
  }
  // 否则刷新
  reset({ page: query.value.page });
})
// 页面高度动态，可能导致第一次异常，等数据回来后再开启
watch(commentsLength, (now, old) => {
  if (!now) return
  enablePushUp(true)
})

// 下拉，上一页
usePullDownRefresh(async () => {
  pulldown = true;
  if (query.value.page > 1) {
    page.value--
    return
  }
  reset({ page: query.value.page });
});
//# endregion

//# region 快照
useScrollEnd((pos) => {
  scrollTop = pos.scrollTop;
  snapshot();
});
onUnmounted(() => {
  snapshot();
});
//# endregion

//# endregion
//# region 页面定义
definePageConfig({
  navigationBarTitleText: "",
  enablePullDownRefresh: true,
  onReachBottomDistance: 200,
});
//# endregion
</script>

<style lang="less">
.post-detail {
  position: relative;
  // 扣除最下面的card的底边距
  padding-bottom: calc(50px - var(--card-margin-bottom, 10px));
  min-height: 100vh;
  box-sizing: border-box;
}
.push-up{
  transform: translateY(calc(var(--page-padding) + 100px));
  height: 10px;
  background-color: red;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  box-sizing: content-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  background-color: var(--bg-color-darken, #d1d9c1);
}

.message {
  text-align: center;
  padding-top: 10vh;
}

.track {
}

.author {
  font-size: var(--font-size-small, 12px);
  color: #999;
}
</style>
