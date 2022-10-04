import {defineStore} from "pinia";
import Taro from "@tarojs/taro";
import {storage} from "@/utils";
import {visit} from "@/api";
import * as api from "@/api";

interface UserInfo {
  // id
  "member_uid":  string; //"246801",
  // 昵称
  "member_username":  string; //"redbuck",
  // 头像
  "member_avatar":  string; //"https://avatar.saraba1st.com/data/avatar/000/24/68/01_avatar_small.jpg",
  // 等级id
  "groupid":  string; //"53",
  "formhash":  string; //"a7ba56a5",
  "ismoderator":  string; //null,
  // 阅读权限
  "readaccess":  string; //"100",
}

export const useUser = defineStore('user', {
  state() {
    return {
      userInfo: null
    }
  },
  actions: {
    setUser(user: UserInfo) {
      this.userInfo = user
    },
    async login(payload) {
      await visit()
      const res = await api.login(payload)
      if (!res.success) {
        Taro.showToast({title: '登录失败！', icon: 'none', duration: 2000});
        return false
      }
      this.setUser(res.data.Variables)
      Taro.showToast({title: res.data.Message?.messagestr || '登录成功！', duration: 2000, icon: 'none'})
      return true
    },
    save() {
      storage.set('user', this.userInfo)
    },
    restore() {
      const user = storage.get('user')
      if (!user) return
      this.setUser(user)
    }
  },
  getters:{
  }
})
