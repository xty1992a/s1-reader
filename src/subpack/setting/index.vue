<template>
  <IPage>
    <view class="setting-page">
      <view class="form">
        <nut-form :model-value="formData" ref="ruleForm">

          <nut-collapse v-model:active="activeNames" icon="down-arrow">
            <nut-collapse-item title="颜色" name="color">

              <nut-form-item label="背景颜色" prop="bgColor">
                <view
                    @click="pickColorBy('bgColor')"
                    class="color-picker"
                    :style="{'--color': formData.bgColor}"
                >{{ formData.bgColor }}</view>
                <Color v-model="formData.bgColor"/>
              </nut-form-item>

            </nut-collapse-item>
          </nut-collapse>

        </nut-form>
      </view>
      <ColorPicker id="setting"/>
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: 'PageSetting'
}
</script>
<script setup lang="ts">
import {reactive, ref, onActivated} from "vue";
import {useTheme} from "@/store";
import {theme} from '@/types';
import {THEME} from "@/const/config";
import ColorPicker from '@/components/color-picker/ColorPicker.vue';
import Color from './IColor.vue'
import {useColor} from '@/components/color-picker/hooks';

const themeStore = useTheme();

const [pickColor] = useColor('setting');

const ruleForm = ref(null);
const formData = reactive<theme.ThemeConfig>(THEME);

const pickColorBy = async (prop: keyof theme.ThemeConfig) => {
  const color = formData[prop]
  if ((typeof color) !== 'string') return
  console.log('pick by ', prop, formData[prop]);
  const res = await pickColor(color as string);
  if (!res.success) return;
  formData[prop] = res.color;
};

onActivated(() => {
  Object.entries(themeStore.config || {})
      .forEach(([k, v]) => {
        formData[k] = v;
      });
});

const activeNames = reactive([1, 2]);
const title = reactive({
  title1: '标题1',
  title2: '标题2',
  title3: '标题3',
});
</script>

<style lang="less">
.setting-page {
  .nut-collapse-item {
    .collapse-item {
      padding: 13px 36px 13px 16px;
    }

    .collapse-wrapper .collapse-content {
      padding: 0;

      .nut-cell {
        background-color: #f9f9f9;
      }
    }
  }

  .color-picker{
    &:before{
      content:'';
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: var(--color);
      margin-right: 5px;
      border: 1px solid #e5e5e5;
    }
  }
}
</style>
