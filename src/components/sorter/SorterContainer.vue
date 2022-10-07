<template>
  <view class="sorter-container"
        :id="state.id"
        :catch-move="true"
        @touchstart.prevent="onStart"
        @touchmove.prevent="onMove"
        @touchend.prevent="onEnd"
        @touchcancel.prevent="onEnd"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import {computed, provide, reactive, watch} from 'vue';
import Taro from "@tarojs/taro";
import {getElRect, rdm, Rect} from "@/utils";
import debounce from "lodash/debounce";
const emits = defineEmits(['change'])
const props = defineProps<{list: string[]}>()

type IRect = Taro.NodesRef.BoundingClientRectCallbackResult & {index: number}

watch(computed(() => props.list.join('')), () => {
  console.log('should refresh')
  invokeAll({
    type: 'refresh'
  })
})

interface ChildHodler {
  id: string,
  index: number,
  rect: IRect
  invoke: Function
}

const staticState = {
  x: 0,
  y: 0,
  parentRect: new Rect({
    index: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })
}
const state = reactive({
  current: -1,
  currentId: '',
  hitIndex: -1,
  id: 'sorter_container' + rdm(),
  // 子组件上报自己的信息
  children: [] as ChildHodler[],
  rect: {
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
  }
});

const resetWorld = () => {
  staticState.x = 0
  staticState.y = 0
  staticState.parentRect = new Rect({
    index: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })

  state.current = -1
  state.currentId = ''
  state.hitIndex = -1
}


/**
 * 子组件的盒子，原点重置为父组件的左上角
 * */
const rectList = computed(() => state.children.map(it => {
  const pR = state.rect
  const cR = it.rect
  return new Rect({
    width: cR.width,
    height: cR.height,
    top: cR.top - pR.top,
    left: cR.left - pR.left,
    index: cR.index
  })
}))
const currentRect = computed(() => rectList.value[state.current])

/**
 * 子元素数量变更，即更新元素的盒子
 * */
watch(computed(() => state.children.length), debounce(() => {
  getRect()
}))
/**
 * provide给子组件进行注册的方法，以此与子组件进行通信
 * */
const registerChild = (payload: ChildHodler) => {
  state.children = state.children
      .filter(it => it.id !== payload.id)
      .concat(payload);
};

/**
 * 批量通知子组件
 * */
const invokeAll = (payload: Record<string, any> & {type: string}) => {
  state.children.forEach(({invoke}) => invoke({
    id: state.currentId,
    ...payload,
  }))
}
provide('__sorter-component', {
  registerChild,
});

/**
 * 更新容器盒子，确定与子组件们的位置关系
 * */
const getRect = async () => {
  const res = await getElRect('#' + state.id)
  if (!res) return
  state.rect = res
}

function swap(array: any[], {source, target}: {source: number, target: number}) {
  const list = [...array];
  let temp = list.splice(source, 1);
  let start = list.splice(0, target);
  return [...start, ...temp, ...list]
}

/**
 * 主要逻辑
 * 拖拽排序逻辑基于touch事件
 * start时，产生一个源头index,source
 * move时，将子组件与触点位置对比得到一个目标index,target
 * */
watch([computed(() => state.hitIndex), computed(() => state.current)], (now) => {
  const [target, source] = now
  if (now.some(i => i === -1)) return

  const oldList = rectList.value.map(it => it.index)
  const finalList = swap(oldList, {source, target})
  const offsetList = finalList.map((n,i) => {
    const oldIndex = oldList.findIndex(m => m === n)
    if (i === target) return 0
    return i - oldIndex
  })
  console.log('拖拽情况: 第%s个，移动到%s', source, target, finalList, offsetList)

  invokeAll({
    type: 'effect',
    source: state.current,
    target: state.hitIndex,
    rect: currentRect.value,
  })
})


const onStart = e => {
  getElRect('#'+state.id)
  .then(res => {
    if (!res) return
    staticState.parentRect = new Rect({
      index: 0,
      left: res.left,
      top: res.top,
      width: res.width,
      height: res.height
    })
  })
  // getRect()
  const [point] = e.touches
  if (point) {
    staticState.x = point.clientX
    staticState.y = point.clientY
  }

  if (!e.target?.dataset?.id) return

  state.current = state.children.findIndex(it => it.id === e.target.dataset.id)
  state.currentId = e.target.dataset.id
};

const onMove = e => {
  if (state.current === -1) return
  const [point] = e.touches
  const log = (...args) => console.log('[move]', ...args)

  if (point) {
    const deltaX = point.clientX - staticState.x
    const deltaY = point.clientY - staticState.y

    invokeAll({
      type: 'move',
      id: state.currentId,
      position: {x: point.clientX, y: point.clientY},
      delta: {x: deltaX, y: deltaY}
    })

    const _point = {
      x: point.clientX - staticState.parentRect.left,
      y: point.clientY - staticState.parentRect.top
    }

    if (_point.y > staticState.parentRect.bottom || _point.x >  staticState.parentRect.right) {
      state.hitIndex = rectList.value.length - 1
      return;
    }
    if (_point.y < staticState.parentRect.top || _point.x <  staticState.parentRect.left) {
      state.hitIndex = 0
      return;
    }

   state.hitIndex = rectList.value.findIndex(rect => Rect.hit(_point, rect))
  }

  // log(e)
}
const onEnd = e => {
  if (state.current === -1) return
  const [point] = e.touches
  invokeAll({
    id: state.currentId,
    type: 'end',
    position: {x: point?.clientX, y: point?.clientY},
    delta: {x: 0, y: 0}
  })
  emits('change', {source: state.current, target: state.hitIndex})
  resetWorld()
}

</script>

<style lang="less">

</style>
