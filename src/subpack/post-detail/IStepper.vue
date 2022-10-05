<template>
  <div class="i-stepper">
    <div type="flex" class="i-stepper-view">
      <div span="8" class="stepping-block">
        <nut-icon
          class="stepping-btn"
          :class="{ disabled: canLeft }"
          @click="step(-1)"
          name="left"
        ></nut-icon>
        <nut-icon
          class="stepping-btn"
          :class="{ disabled: canRight }"
          @click="step(1)"
          name="right"
        ></nut-icon>
      </div>
      <div span="8" class="pagging-block">
        <p class="pagging-btn" @click="pick('current')">
          {{ props.current }}/{{ pages }}
        </p>
        <p class="pagging-btn" @click="pick('size')">{{ props.size }}</p>
      </div>
      <!--    <div></div>-->
    </div>
    <nut-picker
      style="height: 200px"
      v-model:visible="state.visible"
      :columns="columns"
      v-model="vValue"
      :title="title"
      @confirm="confirm"
    >
    </nut-picker>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { limit } from "@/utils";
const props = withDefaults(
  defineProps<{
    current: number;
    total: number;
    size: number;
  }>(),
  {
    current: 0,
    total: 0,
    size: 10,
  }
);
const emits = defineEmits(["update:current", "update:size"]);

const state = reactive({
  visible: false,
  refresh: true,
  pickType: "",
});
const pages = computed(() => {
  if (!props.total) return 0;
  if (!props.size) return 0;
  return Math.ceil(props.total / props.size);
});
const canLeft = computed(() => props.current <= 1);
const canRight = computed(() => props.current >= pages.value);
const pageOptions = computed(() => {
  if (!pages.value) return [];

  return [...Array(pages.value)].fill(0).map((_, i) => ({
    text: `第 ${i + 1} 页`,
    value: i + 1,
  }));
});

const sizeOptions = [10, 20, 30, 40].map((n) => ({
  text: `每页 ${n} 条`,
  value: n,
}));

const columns = computed(() => {
  const list =
    {
      ["current"]: pageOptions.value,
      ["size"]: sizeOptions,
    }[state.pickType] || [];
  console.log(pageOptions.value, list);
  return list;
});

const vValue = computed({
  get: () => {
    switch (state.pickType) {
      case "current":
        return [props.current];
      case "size":
        return [props.size];
      default:
        return [];
    }
  },
  set: (v) => {
    console.log(v);
  },
});
const title = computed(() => {
  return {
    current: "选择页码",
    size: "选择每页数量",
  }[state.pickType];
});
const updateCurrent = (value: number) => {
  const limitFn = limit(1, pages.value);
  emits("update:current", limitFn(value));
};

const step = (delta: number) => {
  updateCurrent(props.current + delta);
};

const pick = (type) => {
  state.pickType = type;
  console.log(columns);
  state.visible = true;
};

const confirm = ({ selectedValue: [value] }) => {
  console.log(value);
  switch (state.pickType) {
    case "current":
      updateCurrent(value);
      break;
    case "size":
      emits("update:size", value);
      updateCurrent(1);
      break;
  }
  state.pickType = "";
};
</script>

<style lang="less">
.i-stepper {
  height: 100%;
  picker-view {
    height: 200px !important;
  }

  .nut-picker__bar {
    background-color: var(--bg-color-darken, #d1d9c1);
  }
  .i-stepper-view {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .stepping-block {
    text-align: center;
  }

  .pagging-block {
    display: flex;
    align-items: center;
  }

  .btn-like {
    border-radius: 4px;

    &:active {
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.2) inset;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.4;
    }
  }

  .stepping-btn {
    width: 40px;
    line-height: 50px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    .btn-like;
  }

  .pagging-btn {
    padding: 0 15px;
    margin-left: 10px;
    background-color: var(--bg-color, #f6f7eb);
    .btn-like;
  }
}
</style>
