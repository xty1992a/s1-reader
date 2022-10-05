<template name="thread-list">
  <IPage>
    <view class="page-index">
      <view v-if="user.userInfo" class="user-info">
        <img class="avatar" :src="user.userInfo.member_avatar" />
        <p>{{ user.userInfo.member_username }}</p>
      </view>
      <view v-else class="form">
        <nut-form :model-value="formData" ref="ruleForm">
          <nut-form-item
            label="账号"
            prop="username"
            required
            :rules="[{ required: true, message: '请填写账号' }]"
          >
            <input
              class="nut-input-text"
              placeholder="请输入账号"
              type="text"
              v-model="formData.username"
              @blur="validBy('username')"
            />
          </nut-form-item>
          <nut-form-item
            label="密码"
            prop="password"
            required
            :rules="[{ required: true, message: '请填写密码' }]"
          >
            <input
              class="nut-input-text"
              placeholder="请输入密码"
              type="password"
              v-model="formData.password"
              @blur="validBy('password')"
            />
          </nut-form-item>
        </nut-form>
        <nut-button
          style="width: 100%; border-radius: 6px"
          color="#CCCC99"
          size="normal"
          @click="submit"
          >登录</nut-button
        >
      </view>

      <nut-cell-group>
        <nut-cell title="设置" icon="setting" is-link @click="routeToSetting" />
        <nut-cell title="私信" icon="message" is-link @click="routeToMessage" />
        <nut-cell title="收藏" icon="star" is-link @click="routeToFavorite" />
        <nut-cell title="版块" icon="order" is-link @click="routeToForum" />
      </nut-cell-group>
    </view>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageMy",
};
</script>
<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  delCookie,
  routeToMessage,
  routeToSetting,
  routeToFavorite,
  routeToForum,
} from "@/utils";
import { visit } from "@/api";
import { useUser } from "@/store";

const user = useUser();

const ruleForm = ref<any>(null);
const formData = reactive({
  username: "",
  password: "",
});

const validBy = (prop: keyof typeof formData) => {
  ruleForm.value.validate(prop);
};

const clear = async () => {
  delCookie();
  return visit();
};

const submit = async () => {
  const { valid } = await ruleForm.value.validate();
  if (!valid) return;
  console.log("login by", formData);
  await user.login(formData);
  user.save();
};

const reset = () => {
  ruleForm.value.reset();
};
definePageConfig({
  navigationBarTitleText: "我的",
});
</script>

<style lang="less">
.page-index {
  .form {
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .nut-cell-group__warp {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    .nut-cell {
      background-color: var(--bg-color-lighten, #f9f9f9);
    }
  }
  .user-info {
    padding: 10px;
    text-align: center;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
  }
}
</style>
