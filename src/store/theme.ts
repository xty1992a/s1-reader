import {defineStore} from 'pinia'
import {theme} from '@/types'
import {cases, storage} from '@/utils'
import {THEME} from "@/const/config";

function toCssVarName(name: string) {
  return '--' + cases.paramCase(name)
}

function rpx(value: number) {
  return value * 2 + 'rpx'
}

export const useTheme = defineStore('theme', {
  state() {
    return {
      // 驼峰格式的主题色配置
      config: storage.get('theme.config') || THEME,
      mode: '' // 'dark'
    }
  },
  actions: {
    switchTheme() {
    },

    set(config: Partial<theme.ThemeConfig>) {
      this.config = {
        ...this.config,
        ...config,
      }
    },

    reset() {
      this.config = THEME
    },

    save() {
      storage.set('theme.config', this.config)
    },

    restore() {
      const theme = storage.get('theme.config') || THEME
      console.log('restore theme', storage.get('theme.config'))
      this.theme = theme
    }
  },
  getters: {
    style: state => Object.entries(state.config || {})
      .reduce((style, [k,v]) => {
        let value = v
        if (typeof v === 'number') {
          value = rpx(v)
        }
        return {...style, [toCssVarName(k)]: value}
      }, Object.create(null))
  }
})
