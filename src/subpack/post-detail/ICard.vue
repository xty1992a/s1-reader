<template>
  <view class="post-card">
    <view v-if="displayData">
      <view class="people">
        <text class="index">{{ displayData.number }}</text>
        <text class="author-name">{{ displayData.username }}</text>
        <text class="date-text">{{ displayData.datetime }}</text>
      </view>
      <view class="content">
        <rich-text :user-select="hackBol" :nodes="displayData.message" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { forum } from "@/types";
import { computed, ref } from "vue";
import { fmtRichText, relative } from "@/utils";

const props = defineProps<{
  data: forum.PostItem & { ishost: boolean };
}>();

const hackBol = ref(true);
const displayData = computed(() => {
  const data = props.data;
  if (!data) return null;
  let message = fmtRichText(data.message, data.attachments);
  if (data.message.includes("[attach]") && !data.attachments) {
    message += `<p class="unauth-notice">你尚未登录，无法查看附件</p>`;
  }
  return {
    number: `#${data.number}`,
    message,
    datetime: relative(data.dateline),
    username: `${data.username}${data.ishost ? "（楼主）" : ""}`,
  };
});
</script>

<style lang="less">
.post-card {
  color: var(--font-color, #333);
  border: 1px solid var(--border-color, #e5e5e5);
  margin-bottom: 10px;

  .people {
    line-height: 32px;
    font-size: var(--font-size-mini, 10px);
    border-bottom: 1px solid var(--border-color, #e5e5e5);
    padding: 0 var(--card-padding, 6px);

    .index {
      font-weight: 500;
    }

    .author-name {
      font-size: var(--font-size-small, 12px);
      font-weight: 500;
      margin: 0 5px;
    }

    .date-text {
    }
  }

  .content {
    padding: var(--card-padding, 6px);
    font-size: var(--font-size-normal, 14px);
    overflow: auto;

    .quote {
      border-left: 3px solid var(--quote-border-color, #022c80);
      background-color: var(--quote-bg-color, #f9f9f9);
      padding: 5px 5px 5px 10px;
    }

    .pstatus {
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
