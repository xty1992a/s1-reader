<template>
  <view
      class="color-picker"
      :style="{'--color': modelValue}"
      @click="$emit('click')"
  >{{ modelValue }}</view>
</template>

<script setup lang="ts">
 defineProps(['modelValue'])
 defineEmits(['update:modelValue', 'click'])
</script>

<style lang="less">

</style>
