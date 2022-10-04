import Taro from "@tarojs/taro";
import {homePath, postDetailPath, settingPath} from "@/const/config";

export function getParams(dft: Record<string, string> = {}) {
  return Taro?.getCurrentInstance()?.router?.params ?? dft
}

export function routeToHome() {
  return Taro.switchTab({url: homePath})
}

export function routeToSetting() {
  return Taro.navigateTo({url: settingPath})
}

export function routeToPostDetail(id: string) {
  return Taro.navigateTo({url: postDetailPath + '?tid='+id})
}
