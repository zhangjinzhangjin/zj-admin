<template>
  <div class="mainSetting">
    <div class="header">
      <div class="avatar" style="cursor: pointer" @click="toPersonalPage">
        <UserAvatar />
      </div>
      <div class="desp">
        <div class="ub">
          <span class="name">{{ userInfo.name }}</span>
          <span class="position">{{ userInfo.postionName }}</span>
        </div>
        <div class="department">
          {{ userInfo.departmentName }}
        </div>
      </div>
    </div>
    <div class="content">
      <el-menu mode="vertical" default-active="1-0" :unique-opened="true">
        <template v-for="(submenu, index) in menus" :key="submenu.key">
          <el-sub-menu v-if="submenu.menus && submenu.menus.length" :index="index.toString()">
            <template #title>
              <div class="menu-item">
                <svg-icon :icon-class="submenu.icon" class="menuIcon"></svg-icon>
                <span>{{ submenu.title }}</span>
              </div>
            </template>
            <el-menu-item v-for="(item, subIndex) in submenu.menus" :index="index + '-' + subIndex" :key="item.key"
              @click="clickMenu(submenu.key, item.key)" :class="{
                currentSelect: (submenu.key == 'lang' && currentLang == item.key) || (
                  submenu.key == 'role' && currentRole == item.key
                )
              }">
              {{ item.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="index.toString()" @click="clickMenu(submenu.key)">
            <div class="menu-item">
              <svg-icon :icon-class="submenu.icon" class="menuIcon"></svg-icon>
              <span>{{ submenu.title }}</span>
            </div>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="ub ub-pc logoutButtonWrapper">
        <el-button class="logoutButton" type="primary" size="large" @click="logout">退出登录</el-button>
      </div>
    </div>
    <ModifyPasswordDialog v-model:visible="dialogVisible" v-if="dialogVisible" />
  </div>
</template>
<script setup lang="ts">
import common from "@/common"
import { useRouter } from "vue-router"
import { useUserStoreWithOut } from "@/store/modules/user"
import { useAppStoreWithOut } from "@/store/modules/app"
import UserAvatar from "@/components/UserAvatar/index.vue"
import { computed, reactive, ref } from "vue";
import ModifyPasswordDialog from "./ModifyPasswordDialog.vue"
defineOptions({
  name: "MainSetting"
})
const emit = defineEmits(['changePanel', 'closeSetting'])
const userStore = useUserStoreWithOut()
const appStore = useAppStoreWithOut();
const userInfo = computed(() => userStore.getUserInfo)
const currentLang = computed(() => appStore.getLocale)
const { push, replace } = useRouter();
// 点头像跳转到个人主页
const toPersonalPage = () => {
  let path = common.getRouteByPath("/personal-homepage");
  if (path) {
    push(path);
  }
}
const currentRole = computed(() => userStore.getRole)
const roleList = computed(() => userStore.getRoleList) as any
const menus = reactive([
  {
    key: "lang",
    title: "多语言",
    icon: "lang-select",
    menus: [
      {
        key: "zh-CN",
        title: "中文"
      },
      {
        key: "en",
        title: "English"
      },
      {
        key: "ja",
        title: "日文"
      }
    ]
  },
  {
    key: "role",
    title: "角色选择",
    icon: "role-select",
    menus: roleList.value.map(item => ({ key: item.id, title: item.label }))
  },
  {
    key: "modifyPassword",
    title: "修改密码",
    icon: "password-edit",
  },
  {
    key: "themeSet",
    title: "主题布局",
    icon: "theme-center",
  },
])
const dialogVisible = ref(false)
const clickMenu = (key: string, subkey?: string) => {
  switch (key) {
    case "lang":
      console.log("now current lang is " + subkey)
      break;
    case "role":
      console.log("now current role is " + subkey)
      break;
    case "modifyPassword":
      dialogVisible.value = true
      break;
    case "themeSet":
      emit('changePanel')
      break;
    default:
      break;
  }
}
const logout = async () => {
  await userStore.logout()
  common.tip("退出登录成功", "success")
  emit('closeSetting')
  replace({ path: "/login" })
}
</script>
<style lang="scss" scoped>
.mainSetting {
  .header {
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0px 20px;

    .avatar {
      padding-top: 5px;
      margin-right: 20px;
    }

    .desp {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-family: Source Han Sans SC;
      font-weight: 400;
      width: 80%;

      .name {
        color: #2e2f48;
        margin-right: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .position {
        color: var(--el-color-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .department {
        color: #cccccc;
      }
    }
  }

  .content {
    :deep(.el-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }

      .el-sub-menu {
        .el-sub-menu__title {
          height: 45px;
          padding: 0px;
        }

        .el-menu--inline {
          background: #f3f3f3;
        }

        .el-menu-item {
          padding: 0px 50px;

          &.currentSelect {
            color: var(--el-color-primary);
          }
        }
      }

      &>.el-menu-item {
        height: 45px;
        padding: 0px;

        &.is-active {
          color: #303133;
        }
      }
    }

    .menu-item {
      height: 40px;
      color: #808080;
      padding: 0 10px;
      display: flex;
      align-items: center;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
      flex: 1;

      .menuIcon {
        margin-right: 10px;
      }
    }

    .logoutButtonWrapper {
      margin-top: 50px;

      .logoutButton {
        width: 80%;
      }
    }
  }
}
</style>