import type { App, Component } from "vue";
import Iconfont from "@/components/Iconfont";
import IPage from "@/components/IPage.vue";

export default {
  install(app: App) {
    app
      .component(Iconfont.name, Iconfont)
      // @ts-ignore
      .component("IPage", IPage);
  },
};
