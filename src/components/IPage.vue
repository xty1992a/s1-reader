<template>
  <view class="i-page" :style="style">
    <view class="i-page-track" :style="style2">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useTheme } from "@/store";
import {computed, nextTick, provide, reactive} from "vue";
import {getPageScroll, sleep} from "@/utils";
import Taro from "@tarojs/taro";
const theme = useTheme();

const state = reactive({
  stopScroll: false,
  scrollTop: 0
})

const style = computed(() => {
  const _style: Record<string, any> = {}

  if (state.stopScroll) {
    _style.height = '100vh'
    _style.overflow = 'hidden'
  }

  return {
    ...theme.style, ..._style
  }
})

const style2 = computed(() => {
  if (!state.stopScroll) return {}
  return {
     // transform: `translateY(${-state.scrollTop}px)`
    marginTop: -state.scrollTop + 'px'
  }
})

//# region 向子组件提供全局方法

const stopPageScroll = async () => {
  const res = await getPageScroll()
  state.stopScroll = true
  state.scrollTop = res.scrollTop

  // await sleep(100)
  console.log('当前页面滚动高度',res.scrollTop)
  // return Taro.pageScrollTo({scrollTop: res.scrollTop, duration: 0})
}
const enablePageScroll =  async () => {
  console.log('apply enable scroll')
  state.stopScroll = false
  await sleep(10)
  // return Taro.pageScrollTo({scrollTop: state.scrollTop, duration: 0})
}

provide('__i-page-component', {
  stopPageScroll,
  enablePageScroll
})
//# endregion

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
