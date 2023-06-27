<script setup lang="ts">
import { LoginForm } from './components'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
</script>
<template>
  <div class="ub loginWrapper">
    <div class="ub-f1 left">
      <div class="ub">
        <img src="@/assets/imgs/logo.png" alt="" class="logo" />
        <span class="title">{{ appStore.getTitle }}</span>
      </div>
      <div class="content ub ub-pc ub-ac">
        <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft" style="height:450px;">
          <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="contentImg" />
          <div class="contentString" key="2">欢迎使用~~</div>
        </TransitionGroup>
      </div>
    </div>
    <div class="ub-f1 right ub ub-pc ub-ac">
      <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="content">
            <LoginForm />
          </div>
        </Transition>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loginWrapper {
  height: 100%;
  .left {
    padding: 30px;
    background-color: rgb(39, 54, 83);
    .logo {
      width: 48px;
      height: 48px;
      margin-right: 10px
    }
    .title {
      font-size: 20px;
      line-height: 40px;
      color: white;
      font-weight: 700;
    }
    .content {
      height: calc(100% - 60px);

      .contentImg {
        width: 350px;
      }

      .contentString {
        font-size: 1.875rem;
        line-height: 2.25rem;
        color: white;
      }
    }
  }
  .right{
    padding: 30px;
    .content{
      max-width: 500px;
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
