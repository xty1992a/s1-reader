import {defineStore} from "pinia";
import Taro from "@tarojs/taro";
import {getTabbar} from "@/utils";
import {tabbarArray} from "@/const/config";

export const useTabbar = defineStore('tabbar', {
  state: () => {
    return {
      tabindex: 0,
      tabbar: {
        list: []
      }
    } as {
      tabindex: number,
      tabbar: Taro.TabBar
    }
  },
  actions: {
    setIndex(index: number) {
      this.tabindex= index
      const item = this.list[index]
      Taro.switchTab({
        url: '/' + item.pagePath
      })
    },
    setup() {
      const component = Taro.getCurrentInstance()
      const path = (component.router?.path ?? '').replace(/^\//, '')
      const tabbar = getTabbar()

      const index = tabbar.list.findIndex((it) => it.pagePath === path)
      if (index<0) return
      console.log('current component', component, path, index)

      this.tabbar = tabbar
      this.tabindex =index
    }
  },
  getters: {
    list: (state) => {
      return state.tabbar.list.map((it: Taro.TabBarItem, index) => {
        const item = tabbarArray.find(i => i.pagePath === it.pagePath)

        return {
          ...item,
          active: index === state.tabindex,
        }
      })
    },
  }
})
