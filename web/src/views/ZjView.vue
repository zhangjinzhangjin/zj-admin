<template>
  <div>
    <span>{{ str }}</span>
    <el-button type="primary" size="default" @click="alertOne">点击</el-button>
    <el-date-picker v-model="date" placeholder="选择日期时间">
    </el-date-picker>
    <el-icon color="red" size="50"><user-filled /></el-icon>
    <el-button type="primary" size="default" @click="alertOne">点击</el-button>
    <svg-icon icon-class="logo" class="loack-icon" color="green"></svg-icon>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router'
const router= useRouter()
const str = ref("hello");
const alertOne = () => {
  router.push("/login")
};
const date = ref("1990-02-09")
</script>
<style scoped></style>
