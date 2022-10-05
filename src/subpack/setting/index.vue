<template>
  <IPage>
    <view class="setting-page">
      <view class="form" v-if="formData">
        <nut-form :model-value="formData" ref="ruleForm">
          <nut-collapse
            v-model:active="activeModule"
            icon="down-arrow"
            :accordion="true"
          >
            <nut-collapse-item title="颜色" name="color">
              <nut-form-item label="背景颜色" prop="bgColor">
                <IColor
                  v-model="formData.bgColor"
                  @click="pickColorBy('bgColor')"
                />
              </nut-form-item>
              <nut-form-item label="背景颜色(深)" prop="bgColorDarken">
                <IColor
                  v-model="formData.bgColorDarken"
                  @click="pickColorBy('bgColorDarken')"
                />
              </nut-form-item>
              <nut-form-item label="字体颜色" prop="fontColor">
                <IColor
                  v-model="formData.fontColor"
                  @click="pickColorBy('fontColor')"
                />
              </nut-form-item>
              <nut-form-item label="边框颜色" prop="borderColor">
                <IColor
                  v-model="formData.borderColor"
                  @click="pickColorBy('borderColor')"
                />
              </nut-form-item>
              <nut-form-item label="引用边框颜色" prop="quoteBorderColor">
                <IColor
                  v-model="formData.quoteBorderColor"
                  @click="pickColorBy('quoteBorderColor')"
                />
              </nut-form-item>
              <nut-form-item label="引用背景颜色" prop="quoteBorderColor">
                <IColor
                  v-model="formData.quoteBgColor"
                  @click="pickColorBy('quoteBgColor')"
                />
              </nut-form-item>
              <nut-form-item label="激活颜色" prop="activeColor">
                <IColor
                  v-model="formData.activeColor"
                  @click="pickColorBy('activeColor')"
                />
              </nut-form-item>
            </nut-collapse-item>

            <nut-collapse-item title="尺寸" name="size">
              <nut-form-item label="页边距" prop="pagePadding">
                <nut-inputnumber v-model.number="formData.pagePadding" />
              </nut-form-item>
              <nut-form-item label="卡片内边距" prop="cardPadding">
                <nut-inputnumber v-model.number="formData.cardPadding" />
              </nut-form-item>
              <nut-form-item label="卡片底边距" prop="cardMarginBottom">
                <nut-inputnumber v-model.number="formData.cardMarginBottom" />
              </nut-form-item>
            </nut-collapse-item>

            <nut-collapse-item title="字号" name="fontsize">
              <nut-form-item label="正文" prop="fontSizeNormal">
                <nut-inputnumber v-model.number="formData.fontSizeNormal" />
              </nut-form-item>
              <nut-form-item label="次级" prop="fontSizeSmall">
                <nut-inputnumber v-model.number="formData.fontSizeSmall" />
              </nut-form-item>
              <nut-form-item label="轻量" prop="fontSizeMini">
                <nut-inputnumber v-model.number="formData.fontSizeMini" />
              </nut-form-item>
            </nut-collapse-item>
          </nut-collapse>
        </nut-form>

        <view class="btn-wrap">
          <nut-button shape="square" @click="reset" size="normal"
            >重置</nut-button
          >
        </view>
      </view>
      <ColorPicker id="setting" />
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageSetting",
};
</script>
<script setup lang="ts">
import { reactive, ref, onBeforeMount, computed, watch } from "vue";
import { useTheme } from "@/store";
import { theme } from "@/types";
import ColorPicker from "@/components/color-picker/ColorPicker.vue";
import IColor from "./IColor";
import { useColor } from "@/components/color-picker/hooks";

const themeStore = useTheme();

const [pickColor] = useColor("setting");

const ruleForm = ref(null);
const formData = computed(() => themeStore.config);

watch(
  formData,
  () => {
    themeStore.save();
  },
  { deep: true }
);

const pickColorBy = async (prop: keyof theme.ThemeConfig) => {
  const color = formData.value[prop];
  if (typeof color !== "string") return;
  const res = await pickColor(color as string);
  if (!res.success) return;
  formData.value[prop] = res.color;
};

const reset = () => {
  themeStore.reset();
};

const activeModule = ref("");
</script>

<style lang="less">
.setting-page {
  .nut-collapse-item {
    .collapse-item {
      padding: 13px 36px 13px 16px;
      //background-color: var(--bg-color-lighten, #f9f9f9);
    }

    .collapse-wrapper .collapse-content {
      padding: 0;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08) inset;

      background-color: transparent;
      .nut-cell {
        background-color: transparent;
      }
    }
  }

  .color-picker {
    &:before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: var(--color);
      margin-right: 5px;
      border: 1px solid #e5e5e5;
    }
  }

  .btn-wrap {
    button {
      width: 100%;
      font-size: 14px;
      border: 0;
      border-radius: 6px;
      background: var(--bg-color-darken);
      color: var(--active-color);
    }
  }
}
</style>
