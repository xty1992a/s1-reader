import Taro from "@tarojs/taro";
import type { api } from "@/types";
import {baseUrl} from "@/const/config";
import {setCookie, getCookie} from "@/utils";

const dftConfig: api.Config = {
  loading: true,
  toast: false,
  isSuccess: (_) => true,
  fmtData: (res) => res.data,
  message: (_) => {
    try{
      return _?.data.Message?.messagestr
    }catch (e) {
      return '解析失败！'
    }
  },
};

const dftOption: api.Option = {
  method: 'GET',
}

export function request<T = any>(
  url: string,
  option: api.Option,
  config: Partial<api.Config> = {}
) {
  const opt = {...dftOption, ...option}
  const cfg = { ...dftConfig, ...config };

  const toast = (message: string) => {
    if (!cfg.toast) return;
    Taro.hideLoading();
    return Taro.showToast({ title: message, icon: "none" });
  };

  return new Promise<api.Result<T>>((resolve) => {
    cfg.loading && Taro.showLoading({ title: "请求中..." });
    Taro.request({
      url: baseUrl + url,
      header: {
        ...(opt.headers || {}),
        Cookie: getCookie(),
      },
      params: opt.params,
      data: opt.method === "GET" ? opt.params : opt.data,
      ...opt,
      success: (res) => {
        const success = cfg.isSuccess(res);
        const data = cfg.fmtData(res);
        const message = cfg.message(res);
        if (res.header['Set-Cookie']) {
          setCookie(res.header['Set-Cookie'])
        }

        if (!success) {
          toast(message || "请求失败！");
        }
        resolve({ success, data, message: "ok", origin: res });
      },
      fail: (res) => {
        const message = cfg.message(res);
        toast(message || "请求失败！");
        resolve({ success: false, data: res, message, origin: res });
      },
      complete() {
        Taro.hideLoading();
      },
    });
  });
}

export const get = <T>(url: string, params: Record<string, any>, config: Partial<api.Config> ={}) =>
  request<T>(url, { params, method: "GET" }, config);
export const post = <T>(url: string, data: Record<string, any>, config: Partial<api.Config> ={}) =>
  request<T>(url, { data, method: "POST" }, config);
