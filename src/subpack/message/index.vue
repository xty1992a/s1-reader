<template>
  <IPage>
    <div class="page-message">
      <div class="message-item" v-for="it in state.list" :key="it.pmid">
        <nut-row>
          <nut-col span="12">
            <p class="people-name">{{it.tousername}}</p>
            <p class="reply-message">{{it.message}}</p>
          </nut-col>
          <nut-col span="12" class="message-right">
            <p class="date-time">{{ relative(it.lastdateline * 1000) }}</p>
          </nut-col>
        </nut-row>
      </div>
    </div>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageMessage"
};
</script>

<script setup lang="ts">
import {message} from '@/types'
import {computed, onMounted, reactive, watch} from 'vue';
import Taro, {useReachBottom} from '@tarojs/taro'
import {getMessageList} from "@/api";
import {relative} from '@/utils'

const state = reactive({
  query: {
    page: 1
  },
  list: [] as message.MessageItem[]
})

const page = computed({
  get: () => state.query.page,
  set: v => {
    state.query = {
      ...state.query,
      page: v
    }
  }
})
const query = computed(() => state.query)

const fetch = async () => {
  getMessageList({page: state.query.page})
  .then(res => {
    console.log(res)
    if (!res.success) return
    state.list = res.data.Variables.list
  })
}

watch(state.query, () => {
  fetch()
})

onMounted(() => {
  fetch()
})

useReachBottom(() => {
  page.value++
})

definePageConfig({
  navigationBarTitleText: '私信',
  onReachBottomDistance: 200,
})
</script>

<style lang="less">
.page-message{
  .title{

  }
  .message-item{
    color: var(--font-color);
    font-size: var(--font-size-normal);
    border-bottom: 1px solid var(--border-color);
    padding: var(--card-padding);
    margin-bottom: var(--car-margin-bottom);
  }
  .people-name{

  }
  .message-right{
    text-align: right;
    .date-time{
      font-size: var(--font-size-small);
      color: var(--font-color-lighten);
    }
  }
}

</style>
