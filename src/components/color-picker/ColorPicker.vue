<template>
  <i-color
      v-if="refresh"
      :mask="true"
      :show="visible"
      :init-color="color"
      @change="getColor"
      @close="close"
      bindclose
      bindchange
  />
</template>

<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {toHex} from "@/utils";
interface Result {color: string, success: boolean}

const props = defineProps<{id: string}>()

const {visible, color, resolve} = inject(props.id, {visible: false, color: '', resolve(payload: Result) {}})

const refresh = ref(true)

watch([visible], () => {
  if (visible.value) return
  refresh.value = false
  setTimeout(() => {
    refresh.value = true
  }, 50)

})

const getColor = (e) => {
  resolve.value({success: true, color: toHex(e.detail.color)})
}

const close = () => {
  console.log('close', color)
  resolve.value({success: false, color: toHex(color.value)})
}

</script>

<style scoped>

</style>
