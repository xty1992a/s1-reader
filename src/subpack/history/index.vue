<template>
<IPage>
  <div class="page-history">
    <view v-for="it in thread.readList" :key="it.thread.tid">
      <PostCard :data="it.thread" />
    </view>
  </div>
</IPage>
</template>

<script lang="ts">
export default {
  name: "PageHistory"
};
</script>

<script lang="ts" setup>
import {useThread} from '@/store'
import PostCard from '@/components/PostCard.vue'
const thread = useThread()

definePageConfig({
 navigationBarTitleText: '最近浏览'
})
</script>

<style lang="less">

</style>
