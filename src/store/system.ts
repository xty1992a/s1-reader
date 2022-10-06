import {defineStore} from "pinia";
import {storage} from "@/utils";

export const useSystem = defineStore('system', {
  state() {
    return {
      config: (storage.get('system:config') || {
        readCount: 10
      }) as {readCount: number}
    }
  },
  actions: {
    setReadCount(v) {
      this.config.readCount = v
      this.save()
    },
    save() {
      storage.set('system:config', this.config)
    },
    restore() {
      this.config = storage.get('system:config') || {
        readCount: 10
      }
    }
  },
  getters: {
  }
})
