import Taro from "@tarojs/taro";
import * as path from "@/const/config";
import { forumPath } from "@/const/config";

export function getParams(dft: Record<string, string> = {}) {
  return Taro?.getCurrentInstance()?.router?.params ?? dft;
}

export function routeToHome() {
  return Taro.switchTab({ url: path.homePath });
}

export function routeToSetting() {
  return Taro.navigateTo({ url: path.settingPath });
}

export function routeToMessage() {
  return Taro.navigateTo({ url: path.messagePath });
}

export function routeToPostDetail(id: string) {
  return Taro.navigateTo({ url: path.postDetailPath + "?tid=" + id });
}

export function routeToForum(id: string) {
  return Taro.navigateTo({ url: path.forumPath });
}

export function routeToFavorite(id: string) {
  return Taro.navigateTo({ url: path.favoritePath });
}
