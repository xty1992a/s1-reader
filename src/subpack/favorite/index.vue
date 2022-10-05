<template>
  <IPage>
  <div class="page-favorite">
    <p>收藏</p>
    <div class="track">
      <div v-for="it in displayList" :key="it.tid">
        <PostCard :data="it"/>
      </div>
    </div>
  </div>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageFavorite"
};
</script>
<script lang="ts" setup>
import {usePagging} from "@/utils/hooks/usePagging";
import {getFavoriteList} from "@/api";
import {computed, onMounted, watch} from "vue";
import {useReachBottom} from "@tarojs/taro";
import PostCard from '@/components/PostCard.vue'

definePageConfig({
  navigationBarTitleText: '收藏'
})
const {query, page, fetch, list} = usePagging({
  fetch: getFavoriteList
})

const displayList = computed(() => {
  return list.value
      .filter(it => it.idtype === 'tid')
      .map(it => ({
        tid: it.id,
        read: false,
        subject: it.title,
        author: it.author,
        replies: it.replies,
        newreplies: undefined
  }))
})

watch(query, () => {
  fetch()
})

onMounted(() => {
  fetch()
})

useReachBottom(() => {
  page.value++
})

</script>
<style scoped>

</style>
