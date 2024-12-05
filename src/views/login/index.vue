<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { getLoginCodeApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Owl from "./components/Owl.vue"
import { useFocus } from "./hooks/useFocus"

const router = useRouter()
const { isFocus, handleBlur, handleFocus } = useFocus()

/** 登录表单元素的引用 */
const loginFormRef = ref<any>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 登录表单数据 */
const loginFormData: LoginRequestData = reactive({
  username: "admin",
  password: "12345678",
  code: ""
})
/** 登录表单校验规则 */
const loginFormRules = {
  username: [(value) => !!value || "请输入用户名"],
  password: [
    (value) => !!value || "请输入密码",
    (value) => (value.length >= 8 && value.length <= 16) || "长度在 8 到 16 个字符"
  ],
  code: [(value) => !!value || "请输入验证码"]
}
/** 登录逻辑 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  const { valid, errors } = await loginFormRef.value.validate()
  console.log(valid)
  if (valid) {
    loading.value = true
    console.log(111)
    useUserStore()
      .login(loginFormData)
      .then(() => {
        router.push({ path: "/" })
      })
      .catch(() => {
        createCode()
        loginFormData.password = ""
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    console.error("表单校验不通过", errors)
  }
}
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginFormData.code = ""
  // 获取验证码
  codeUrl.value = ""
  getLoginCodeApi().then((res) => {
    codeUrl.value = res.data
  })
}

/** 初始化验证码 */
createCode()
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <Owl :close-eyes="isFocus" />
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/logo-text-2.png" />
      </div>
      <div class="content">
        <v-form ref="loginFormRef" :model="loginFormData" @keyup.enter="handleLogin">
          <v-text-field
            style="margin-bottom: 12px"
            color="primary"
            density="compact"
            variant="outlined"
            label="用户名"
            :rules="loginFormRules.username"
            v-model.trim="loginFormData.username"
            prepend-inner-icon="mdi-account"
            placeholder="请输入"
          />
          <v-text-field
            style="margin-bottom: 12px"
            color="primary"
            density="compact"
            variant="outlined"
            :rules="loginFormRules.password"
            label="密码"
            v-model.trim="loginFormData.password"
            prepend-inner-icon="mdi-lock"
            placeholder="请输入"
            @blur="handleBlur"
            @focus="handleFocus"
          />

          <v-text-field
            style="margin-bottom: 12px"
            color="primary"
            density="compact"
            variant="outlined"
            :rules="loginFormRules.code"
            label="验证码"
            v-model.trim="loginFormData.code"
            prepend-inner-icon="mdi-key"
          >
            <template #append>
              <v-img width="80" :src="codeUrl" @click="createCode" draggable="false">
                <template #placeholder>
                  <v-icon :size="20" style="width: 80px" class="icon" icon="mdi-reload" />
                </template>
                <template #error>
                  <v-icon :size="20" style="width: 80px" class="icon" icon="mdi-reload" />
                </template>
              </v-img>
            </template>
          </v-text-field>

          <v-btn width="100%" :loading="loading" color="primary" @click.prevent="handleLogin">登 录</v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
      }
    }
  }
}
</style>
