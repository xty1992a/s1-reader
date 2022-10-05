import Taro from "@tarojs/taro";

export function getAppConfig() {
  const component = Taro.getCurrentInstance();
  return component.app;
}
