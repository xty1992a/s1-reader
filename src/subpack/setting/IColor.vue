<template>
  <view
      class="color-picker"
      :style="{'--color': modelValue}"
  >{{ modelValue }}</view>
</template>

<script setup lang="ts">
 defineProps(['modelValue'])
 defineEmits(['update:modelValue'])
</script>

<style lang="less">

</style>
