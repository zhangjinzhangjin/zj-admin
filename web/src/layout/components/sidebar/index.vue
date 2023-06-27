<template>
  <div class="sidebar-container" :class="{ 'has-logo': logo }">
    <Logo v-if="logo" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="collapse" :unique-opened="false"
        backgroundColor="var(--menuBg)" textColor="var(--menuText)" activeTextColor="var(--menuActiveText)"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { unref } from "vue"
import { useRouter } from 'vue-router'
import { computed } from 'vue';
import Logo from "./Logo.vue"
import SidebarItem from "./SidebarItem.vue"
defineOptions({
  name: "Sidebar"
})
const appStore = useAppStore()
const permissionStore = usePermissionStore();
const logo = computed(() => appStore.logo)
const collapse = computed(() => appStore.collapse)
const permission_routes = computed(() => permissionStore.getRoutes)
const { currentRoute } = useRouter()
const activeMenu = computed(() => {
  const { meta, path } = unref(currentRoute)
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>
<style scoped lang="scss"></style>