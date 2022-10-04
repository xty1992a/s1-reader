<template>
  <i-color
      :mask="true"
      :show="visible"
      :init-color="color"
      @color="getColor"
      @close="close"
      bindclose
      bindcolor
  />
</template>

<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {toHex} from "@/utils";
interface Result {color: string, success: boolean}

const props = defineProps<{id: string}>()

const {visible, color, resolve} = inject(props.id, {visible: false, color: '', resolve(payload: Result) {}})

const getColor = (e) => {
  console.log('picker get color',e)
  resolve.value({success: true, color: toHex(e.detail.color)})
}

const close = () => {
  console.log('close', color)
  resolve.value({success: false, color: toHex(color.value)})
}

</script>

<style scoped>

</style>
