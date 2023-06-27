<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import type { ElForm } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useValidator } from '@/utils/validator'
import { useStorage } from "@/utils/storage"
import { useUserStoreWithOut } from "@/store/modules/user";
const userStore = useUserStoreWithOut()
const storage = useStorage()
const { required } = useValidator()
const { currentRoute, push } = useRouter()
const rules = {
  username: [required()],
  password: [required()]
}
const loading = ref(false)
const redirect = ref<string>('')
const formParams = reactive({
  username: "admin",
  password: "000000"
})
const elFormRef = ref<ComponentRef<typeof ElForm>>()
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
// 登录
const handleLogin = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        const res = await userStore.login(formParams)
        storage.set("loggedUser", formParams.username)
        push({ path: redirect.value || "/" })
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
<template>
  <div class="loginBorder">
    <h2 class="title">登录</h2>
    <el-form :model="formParams" :rules="rules" ref="elFormRef" label-width="120px" label-position="top" @submit.prevent>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formParams.username" size="large" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formParams.password" type="password" size="large" show-password placeholder="请输入密码" />
      </el-form-item>
      <div>
        <el-button :loading="loading" class="loginButton" type="primary" size="large" @click="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.loginBorder {
  height: 450px;

  .title {
    text-align: center;
    font-size: 1.5em;
    line-height: 2em;
    font-weight: 700;
    margin-bottom: 22px;
  }

  .loginButton {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
