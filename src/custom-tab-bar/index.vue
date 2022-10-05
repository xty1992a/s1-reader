<template>
  <nut-tabbar
    safe-area-inset-bottom
    class="tabbar"
    :active-color="config.activeColor"
    :unactive-color="config.unactiveColor"
    :style="{ background: config.bgColorDarken }"
    v-model:visible="index"
  >
    <nut-tabbar-item
      class-prefix="icon"
      font-class-name="iconfont"
      :tab-title="it.text"
      :icon="it.active ? it.selectedIconPath : it.iconPath"
      :key="it.pagePath"
      v-for="it in list"
    ></nut-tabbar-item>
  </nut-tabbar>
</template>

<script>
import Taro from "@tarojs/taro";
import { mapStores } from "pinia";
import { useTabbar, useTheme } from "@/store";

export default {
  name: "custom-tab-bar",
  computed: {
    ...mapStores(useTabbar),
    ...mapStores(useTheme),
    config() {
      return this.theme.config;
    },
    index: {
      get() {
        return this.tabbar.tabindex;
      },
      set(v) {
        this.tabbar.setIndex(v);
      },
    },
    list() {
      return this.tabbar.list;
    },
  },
  created() {
    this.tabbar.setup();
  },
  options: {
    addGlobalClass: true,
  },
};
</script>

<style lang="less">
.tabbar {
  box-sizing: content-box;
}
</style>
