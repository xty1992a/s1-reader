import {useInterSection} from './useInterSection'
import {rdm, sleep} from "@/utils";
import {useScrollEnd} from './useScrollEnd'
import {onMounted, ref, Ref} from "vue";
import debounce from "lodash/debounce";


/**
 * 构造一个在底部上拉的钩子（模拟器不可用）
 *
 * 实际由intersection观察器与页面滚动事件结合而来。
 * 使用方法
 * 1. 传入回调，调用钩子，得到监听元素id
 * 2. 将id的值，赋给滚动容器的最底部的元素，该元素最好偏移到视口外，但不能脱离文档流。
 *
 * 实际执行中，当相交观察器发现该元素可见时，即说明用户在底部向上拉动，将一个flag置为真。
 * 同时，持续监听页面滚动结束事件，当flag为真，调用钩子回调并重置状态
 * */
export function usePushUp(fn: (...args: any) => any): [Ref<string>, (ok: boolean) => void] {
  const id = ref('push_up_'+rdm())
  let flag = false
  // 页面高度是动态的，给个开关外部控制
  let enable = false

  const _fn = debounce((fn || function() {}), 100)

  useScrollEnd(() => {
    if (!enable) return console.log('没有主动开启！')
    if (!flag) return
    flag = false
    _fn && _fn()
  })

  const observer = useInterSection((res) => {
    flag = true
  })

  onMounted(async () => {
    await sleep(100)
    observer.observe('#'+id.value,)
  })

  return [id, function (ok: boolean) {
    enable = ok
  }]
}
