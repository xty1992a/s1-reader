import Taro from "@tarojs/taro";

export function getAppConfig() {
  const component = Taro.getCurrentInstance()
 return component.app
}

export function getTabbar(): Taro.TabBar {
  const app = getAppConfig()
  return app?.config?.tabBar ?? {
    list: [],
  }
}
