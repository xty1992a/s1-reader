<template>
  <view
      class="color-picker"
      :style="{'--color': modelValue}"
      @click="$emit('click')"
  >{{ modelValue }}</view>
</template>

<script setup lang="ts">
 defineProps(['modelValue'])
 defineEmits(['update:modelValue'])
</script>

<style lang="less">

</style>
