<template>
  <IPage>
    <view class="post-detail">
      <view class="track">
        <view v-if="!state.comments.length && state.message" class="message">
          <view>{{state.message.messagestr}}</view>
        </view>

        <view v-for="(it, index) in state.comments" :key="it.pid" class="card">
          <view>
            <view class="people">
              <text class="index">#{{ index + 1 }}</text>
              <text class="author-name">{{ it.author }}</text>
              <text class="date-text">{{ it.dateline }}</text>
            </view>
            <view class="content">
              <rich-text :user-select="state.userSelect" :nodes="it.message"/>
            </view>
          </view>
        </view>
        <view @click="loadMore">
          <nut-divider hairline style="padding: 0 20px;border-color: #e5e5e5;color: #999" >
            <nut-icon name="loading" v-if="state.loading"></nut-icon>
            <text v-else>没啦</text>
          </nut-divider>
        </view>
      </view>
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: 'PostDetail'
}
</script>

<script setup lang="ts">
import {ref, reactive, onMounted, watch, computed,} from 'vue';
import {getParams, routeToHome} from '@/utils';
import {useReachBottom, usePullDownRefresh, useTitleClick} from '@tarojs/taro';
import {fmtRichText} from '@/utils/richtext';
import * as api from '@/api';
import type {forum} from '@/types';
import Taro from '@tarojs/taro';
import {relative, sleep} from "@/utils";
import uniqBy from 'lodash/uniqBy'

interface State {
  comments: forum.PostItem[];
  thread: forum.ThreadDetail | null;
  message:forum.Message | null
  query: {
    tid: string
    page: number
  };
  userSelect: boolean;
  done: boolean;
  loading: boolean;
}

let pulldown = false
const state = reactive<State>({
  userSelect: true,
  comments: [],
  query: {
    tid: '',
    page: 1,
  },
  loading: false,
  done: false,
  message: null,
  thread: null
});

const reset = (tid = '') => {
  state.comments = [];
  state.query = {
    tid: tid || state.query.tid,
    page: 1,
  };
  state.thread = null;
  state.done = false;
};

onMounted(() => {
  const params = getParams();
  if (!params.tid) {
    Taro.showToast({title: '缺少必要参数！', icon: 'none'});
    routeToHome()
    return;
  }
  reset(params.tid);

  // const observer = Taro.createIntersectionObserver(this)
  console.log(this)
});

const query = computed(() => state.query);

const fetchData = async (delay=0) => {
  state.loading = true
 const res = await api.getPostDetail(state.query, !state.comments.length)
      .finally(() => {
      });
  await sleep(delay)
  state.loading = false
  if (!res.success) return;
  if (!state.thread) {
    await Taro.setNavigationBarTitle({
      title: res.data.Variables.thread.subject
    });
  }
  if (res.data.Message) {
    state.message = res.data.Message
  }
  const list = [
    ...state.comments,
    ...res.data.Variables.postlist.map(it => {
      if (it.authorid === res.data.Variables.thread.authorid) {
        it.author += '(楼主)';
      }

      return ({
        ...it,
        message: fmtRichText(it.message, it.attachments),
        dateline: relative(it.dateline)
      });
    })
  ]
  state.comments = uniqBy(list, 'pid');
  state.thread = res.data.Variables.thread;
  state.done = Number(res.data.Variables.thread.replies) + 1 === state.comments.length;

  if (pulldown) {
    pulldown = false
    Taro.stopPullDownRefresh();
  }
}

const loadMore = () => {
  fetchData(300)
}

watch(query, () => {
  fetchData()
});

useReachBottom(() => {
  if (state.done) return console.log('done');

  state.query = {
    ...state.query,
    page: state.query.page + 1
  };
});

usePullDownRefresh(async () => {
  pulldown = true
  reset();
});

useTitleClick(() => {
  console.log('title click');
  Taro.pageScrollTo({offsetTop: 0, duration: 100});
});

definePageConfig({
  enablePullDownRefresh: true,
  onReachBottomDistance: 200
});
</script>

<style lang="less">
.message{
  text-align: center;
  padding-top: 10vh;
}

.track {
}

.card {
  color: #333;
  border: 1px solid #e5e5e5;
  margin-bottom: 10px;

  .people {
    line-height: 32px;
    font-size: 14px;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 6px;

    .index {
      font-size: 12px;
    }

    .author-name {
      font-size: 13px;
      font-weight: 500;
      margin: 0 5px;
    }

    .date-text {
      font-size: 10px;
    }
  }

  .content {
    padding: 6px;
    font-size: 14px;
    overflow: auto;

    .quote {
      border-left: 3px solid #022C80;
      background-color: #f9f9f9;
      padding: 5px 5px 5px 10px;
    }
  }
}

.author {
  font-size: 12px;
  color: #999;
}
</style>
