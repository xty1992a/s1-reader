import {defineStore} from "pinia";
import {storage} from "@/utils";

interface Config {readCount: number, usePushNext: boolean}

const dftConfig= {
  mk(): Config {
    return {
      readCount: 10,
      usePushNext: false
    }
  }
}

export const useSystem = defineStore('system', {
  state() {
    return {
      config: (storage.get('system:config') || dftConfig.mk()) as {readCount: number, usePushNext: boolean}
    }
  },
  actions: {
    save() {
      storage.set('system:config', this.config)
    },
    restore() {
      this.config = storage.get('system:config') || dftConfig.mk()
    }
  },
  getters: {
  }
})
