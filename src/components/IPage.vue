<template>
  <view class="page" :style="theme.style">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import {useTheme} from '@/store'
const theme = useTheme()
</script>

<style lang="less">
.page{
  background-color: var(--bg-color, #F6F7EB);
  min-height: 100vh;
  padding: var(--page-padding, 12px);
  width: 100vw;
  overflow: hidden;
  color: var(--font-color, #022C80);
}
</style>
