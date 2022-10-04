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

export const useTheme = defineStore<'theme', {config: theme.ThemeConfig | null, mode: string}>('theme', {
  state() {
    return {
      // 驼峰格式
      config: null,
      mode: '' // 'dark'
    }
  },
  actions: {
    setup() {
      if (this.config) return
      this.config = THEME
    },

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
      const theme = storage.get('theme.config')
      if (!theme) {
        this.setup()
      } else {
        this.theme = theme
      }
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
