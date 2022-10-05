<template>
  <IPage>
    <view class="track">
      <view
        v-for="it in thread.list"
        :key="it.tid"
      >
        <PostCard :data="it"/>
      </view>
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageHome",
};
</script>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { useThread } from "@/store";
import { useReachBottom } from "@tarojs/taro";
import PostCard from '@/components/PostCard.vue'

const state = reactive({
  fid: "75",
});
const thread = useThread();

onMounted(() => {
  thread.setFid(state.fid);
  thread.next();
});

useReachBottom(() => {
  console.log("next");
  thread.next();
});

usePullDownRefresh(async () => {
  thread.reset(state.fid);
  await thread.next();
  Taro.stopPullDownRefresh();
});
definePageConfig({
  navigationBarTitleText: "论坛",
  onReachBottomDistance: 200,
  enablePullDownRefresh: true,
});
</script>

<style lang="less">
.track {
}
</style>
