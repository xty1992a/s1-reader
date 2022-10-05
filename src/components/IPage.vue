<template>
  <view class="i-page" :style="theme.style">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { useTheme } from "@/store";
const theme = useTheme();
</script>

<style lang="less">
.i-page {
  background-color: var(--bg-color, #f6f7eb);
  min-height: 100vh;
  padding: var(--page-padding, 12px);
  width: 100vw;
  overflow: hidden;
  color: var(--font-color, #333);
}
</style>
