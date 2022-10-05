<template>
  <IPage>
    <view class="page-home">
      <scroll-view :scroll-x="true" style="width: 100%" class="forum-picker">
        <view class="row-track">
          <view
            class="forum-item"
            :class="{ picked: it.picked }"
            v-for="it in forumList"
            :key="it.fid"
            @click="fid = it.fid"
            >{{ it.name }}</view
          >
        </view>
      </scroll-view>
      <view v-for="it in thread.list" :key="it.tid">
        <PostCard :data="it" />
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
import { computed, onMounted, reactive, watch } from "vue";
import Taro, { usePullDownRefresh, useDidShow } from "@tarojs/taro";
import { useThread } from "@/store";
import { useReachBottom } from "@tarojs/taro";
import PostCard from "@/components/PostCard.vue";

const thread = useThread();

const fid = computed({
  get: () => thread.fid,
  set: (v) => {
    thread.setFid(v);
    thread.next();
  },
});

const forumList = computed(() => {
  return thread.forumList.map((it) => ({
    ...it,
    picked: fid.value === it.fid,
  }));
});
useDidShow(() => {
  const first = thread.forumList[0];
  if (!first) return;
  if (first.fid === fid.value) return;
  fid.value = first.fid;
});

useReachBottom(() => {
  console.log("next");
  thread.next();
});

usePullDownRefresh(async () => {
  if (!fid.value)
    return Taro.showToast({ title: "请先选择版块", icon: "none" });
  thread.reset(fid.value);
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
.page-home {
  .forum-picker{
    margin-top: calc(var(--page-padding) * -1);
    margin-bottom: var(--page-padding, 12px);
  }
  .row-track {
    white-space: nowrap;
    width: fit-content;
    .forum-item {
      padding: 0 20px;
      line-height: 40px;
      display: inline-block;
      &:active {
        box-shadow: 0 0 100px rgba(0, 0, 0, 0.4) inset;
      }
      &.picked {
        background-color: var(--bg-color-darken);
        color: var(--active-color);
      }
    }
  }
}
</style>
