<template>
  <div class="right-menu">
    <search id="header-search" class="right-menu-item" />
    <ScreenFull id="screen-full" class="right-menu-item hover-effect" />
    <UserAvatar id="user-avatar" @click="showSettings" />
  </div>
</template>
<script setup lang="ts">
import Search from "@/components/HeaderSearch/index.vue"
import ScreenFull from "@/components/ScreenFull/index.vue"
import UserAvatar from "@/components/UserAvatar/index.vue"
import { useAppStoreWithOut } from '@/store/modules/app'
defineOptions({
  name: "RightMenu"
})
const appStore = useAppStoreWithOut();
const showSettings = () => { appStore.setShowSettings(true) }
</script>
<style lang="scss" scoped>
.menuPosTop .right-menu .right-menu-item {
  color: #ffffff;
}

.menuPosTop .right-menu .right-menu-item:hover {
  background: rgba(255, 255, 255, 0.025);
}

.menuPosTop .right-menu {
  line-height: 60px;
}

.right-menu {
  justify-content: flex-end;
  float: right;
  height: 100%;
  line-height: 52px;
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
  }


  .right-menu-item {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: var(--navHeadTextColor);
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-wrapper {
    // margin-top: 10px;
    height: 40px;
    margin: 0 20px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .aka-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      background-color: pink;
      color: #fff;
    }

    .icon-svg {
      position: absolute;
      top: -4px;
      right: -1px;
      font-size: 18px;
    }
  }
}</style>