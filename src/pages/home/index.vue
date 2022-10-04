<template>
  <IPage>
    <view class="track">
      <view v-for="it in thread.list" :key="it.tid" class="card" @click="toDetail(it.tid)" :class="{read: it.read}">
        <nut-row type="flex" align="center">
          <nut-col span="20">
            <view class="left">
              <view class="title-text">{{it.subject}}</view>
              <view class="author">{{it.author}}</view>
            </view>
          </nut-col>
          <nut-col span="4">
            <view class="reply-block">
              <text class="reply-count">{{it.replies}}</text>
              <text class="new-reply" v-if="it.newreplies">+{{it.newreplies}}</text>
            </view>
          </nut-col>
        </nut-row>
      </view>
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: 'PageHome'
}
</script>
<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import Taro, {usePullDownRefresh} from '@tarojs/taro';
import {useThread} from '@/store'
import {useReachBottom} from '@tarojs/taro'
import {routeToPostDetail} from "@/utils";

const state = reactive({
  fid: '75'
})
const thread = useThread()

onMounted(() => {
  thread.setFid(state.fid)
  thread.next()
  console.log('monuted')
})

useReachBottom(() => {
  console.log('next')
  thread.next()
})

const toDetail = (id: string) => {
  thread.read(id)
  routeToPostDetail(id)
}
usePullDownRefresh(async () => {
  thread.reset(state.fid);
  await thread.next()
  Taro.stopPullDownRefresh();
});
definePageConfig({
  navigationBarTitleText: '论坛',
  onReachBottomDistance: 200,
  enablePullDownRefresh: true
})
</script>

<style lang="less">
.track{
}
.card{
  color: #333;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  margin-bottom: 10px;
  padding: var(--card-padding) 0;
  --f-color: var(--font-color, #333);
  --b-color: var(--border-color, #e5e5e5);

  &.read{
    --b-color: var(--active-color);
    --f-color: var(--active-color, #022C80);
  }

  .left{
  }
  .reply-block{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--f-color, #333);

    .reply-count{
      min-width: 40px;
      display: inline-block;
      text-align: center;
      line-height: 1.6;
      border-radius: 2px;
      border: 1px solid var(--b-color, #e5e5e5);
      font-size: var(--font-size-min, 10px);
      padding: 0 5px;
    }
    .new-reply{
      font-size: 10px;
      text-align: center;
      display: block;
      min-width: 40px;
    }
  }
  .title-text{
    font-size: var(--font-size-normal, 14px);
  }
}

.author{
  font-size: var(--font-size-small, 12px);
  color: #999;
}
</style>
