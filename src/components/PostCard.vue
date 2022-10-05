<template>
  <view class="card" @click="toDetail(data.tid)" :class="{ read: data.read }">
    <nut-row type="flex" align="center">
      <nut-col span="20">
        <view class="left">
          <view class="title-text">{{ data.subject }}</view>
          <view class="author">{{ data.author }}</view>
        </view>
      </nut-col>
      <nut-col span="4">
        <view class="reply-block">
          <text class="reply-count">{{ data.replies }}</text>
          <text class="new-reply" v-if="data.newreplies"
            >+{{ data.newreplies }}</text
          >
        </view>
      </nut-col>
    </nut-row>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ data: forum.DisplayThreadItem }>();

import { forum } from "@/types";
import { routeToPostDetail } from "@/utils";
import { useThread } from "@/store";
const thread = useThread();

const toDetail = (id: string) => {
  thread.read(id);
  routeToPostDetail(id);
};
</script>

<style lang="less">
.card {
  color: var(--font-color, #333);
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  margin-bottom: var(--card-margin-bottom, 10px);
  padding: var(--card-padding) 0;

  &.read {
    .reply-block {
      color: var(--active-color, #022c80);
      .reply-count {
        border-color: var(--active-color, #022c80);
      }
    }
  }

  .left {
  }
  .reply-block {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .reply-count {
      min-width: 40px;
      display: inline-block;
      text-align: center;
      line-height: 1.6;
      border-radius: 2px;
      border: 1px solid var(--border-color, #e5e5e5);
      font-size: var(--font-size-min, 10px);
      padding: 0 5px;
    }
    .new-reply {
      font-size: 10px;
      text-align: center;
      display: block;
      min-width: 40px;
    }
  }
  .title-text {
    font-size: var(--font-size-normal, 14px);
  }
}

.author {
  font-size: var(--font-size-small, 12px);
  color: #999;
}
</style>
