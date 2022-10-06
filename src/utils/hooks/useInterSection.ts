import {onMounted} from "vue";
import Taro from "@tarojs/taro";

export function useInterSection(fn: (res: any) => void) {
  const state = {observe(target: string) {
    console.warn('调用的太早啦,还没初始化呢！')
    }}

  onMounted(async () => {
    const comp = Taro.getCurrentInstance().page
    if (!comp) return console.log('no comp')
    const observer = Taro.createIntersectionObserver(comp, {
      observeAll: true
    })
    observer.relativeToViewport()
    state.observe = target => {
      console.log('start observer', target)
      observer.observe(target, fn)
    }
    return observer.disconnect.bind(observer)
  })

  return state
}
