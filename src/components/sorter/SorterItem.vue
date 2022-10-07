<template>
  <view class="sort-item"
        :id="state.id"
        :data-id="state.id"
        :style="style"
        :class="{
          ['sort-active']: state.active,
          ['sort-unactive']: !state.active
        }"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import {computed, inject, onMounted, reactive, watch} from "vue";
import {rdm, getElRect, sleep} from "@/utils";

const props = withDefaults(defineProps<{ index: number }>(), {
  index: 0
});

/*
watch(computed(() => props.index), () => {
  refresh()
  console.log('index change!')
})
*/

const upstream = inject('__sorter-component', {
  registerChild(payload: any) {
  }
});

const state = reactive({
  id: 'sorter_item__' + rdm(),
  active: false,
  delta: {
    x: 0,
    y: 0,
  }
});
const style = computed(() => {
  return {
    transform: `translate3d(${state.delta.x}px,${state.delta.y}px,0)`,
    ['--sorter-handler-x']: '600rpx',
    ['--sorter-handler-y']: '20rpx',
    ['--sorter-handler-w']: '40rpx',
    ['--sorter-handler-h']: '40rpx',
  };
});

/**
 * 交给父组件的调用引用
 * */
const onInvoke = ({id, type, ...payload}: { id: string, type: string, [p: string]: any }) => {
  switch (type) {
    case 'start':
      onStart()
      break
    case 'move':
      onMove()
      break
    case 'effect':
      onEffect()
      break
    case 'end':
      onEnd()
      break
    case 'refresh':
      refresh()
  }

  function onEffect() {
    const {index} = props
    const {source, target, rect: currentRect} = payload
    if (props.index === payload.source) return;
    if (!currentRect) return console.log('没有找到当前rect')
    if (target === source) {
      // console.log('自己')
    }
    state.delta = {x: 0, y: 0}
    if (target < source) {
      if (index > source) return;
      if (index < target) return

      state.delta = {
        x: 0, //-currentRect.width,
        y: currentRect.height
      }
      // console.log('上移')
    }
    else {
      if (index < source) return;
      if (index > target) return
      state.delta = {
        x: 0,// currentRect.width,
        y: -currentRect.height
      }
      // console.log('下移')
    }

    console.log('effect', props.index, payload)
    return;
  }

  function onStart() {

  }

  function onMove() {
    if (id !== state.id) return

    state.active = true
    state.delta = payload.delta;
  }

  function onEnd() {
    state.delta = {x: 0, y: 0}
    state.active = false
  }

};

const refresh = async () => {
  const rect = await getElRect('#' + state.id);
  if (!rect) return console.log('no rect');
  console.log('元素盒子', rect)
  upstream.registerChild({
    index: props.index,
    id: state.id,
    rect: {...rect, index: props.index},
    invoke: onInvoke
  });
}

onMounted(async () => {
  await sleep(50);
  refresh()
});

</script>

<style lang="less">
.sort-item {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: var(--sorter-handler-x, 0);
    top: var(--sorter-handler-y, 0);
    width: var(--sorter-handler-w, 100%);
    height: var(--sorter-handler-h, 100%);
    background-color: red;
    opacity: .2;
  }

  &.sort-active{
    z-index: 999;
    box-shadow: 0 0 10px rgba(0,0,0,0.08);
  }

  &.sort-unactive{
    transition: transform .2s;
  }
}
</style>
