import Taro from "@tarojs/taro";

export function getAppConfig() {
  const component = Taro.getCurrentInstance();
  return component.app;
}

export const getElRect = (selector: string) => new Promise<Taro.NodesRef.BoundingClientRectCallbackResult | null>(resolve => {
  const comp = Taro.getCurrentInstance().page
  if (!comp) return resolve(null)
  Taro.createSelectorQuery()
    .in(comp)
    .select(selector)
    .boundingClientRect(res => {
      resolve(res)
    })
    .exec()
})

export const getPageScroll = () => new Promise<Taro.NodesRef.ScrollOffsetCallbackResult>(resolve => {
  Taro.createSelectorQuery().selectViewport().scrollOffset(resolve).exec()
})
