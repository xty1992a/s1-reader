<template>
  <nut-tabbar
      v-model:visible="index"
      safe-area-inset-bottom
      class="tabbar"
      active-color="#022C80"
  >
    <nut-tabbar-item
        :tab-title="it.text"
        :icon="it.active ? it.selectedIconPath : it.iconPath"
        class-prefix="icon"
        v-for="it in list"
        :key="it.pagePath"
        font-class-name="iconfont"

    ></nut-tabbar-item>
  </nut-tabbar>
</template>

<script>
import Taro from '@tarojs/taro'
import {mapStores} from 'pinia';
import {useTabbar} from '@/store';

export default {
  name: 'custom-tab-bar',
  computed: {
    ...mapStores(useTabbar),
    index: {
      get() {
        return this.tabbar.tabindex;
      },
      set(v) {
        this.tabbar.setIndex(v);
      }
    },
    list() {
      return this.tabbar.list;
    }
  },
  created() {
    console.log(Taro.getCurrentInstance().page.getTabBar())
    this.tabbar.setup();
  },
  options: {
    addGlobalClass: true
  }
};

</script>

<style lang="less">
.tabbar{
  background: #D1D9C1;
  box-sizing: content-box;
}
</style>
