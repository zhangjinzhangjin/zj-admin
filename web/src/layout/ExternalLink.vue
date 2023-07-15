<template>
  <div :class="{
    hideSidebar: collapse,
    openSidebar: !collapse,
  }" class="app-wrapper">
    <Sidebar v-if="layout === 'left'" />
    <div :class="{ menuPosTop: layout === 'top' }" class="main-container hasTagsView">
      <div class="headerLineArea">
        <SidebarH v-if="layout === 'top'" />
        <Navbar v-if="layout === 'left'" />
        <TagsView />
      </div>
      <iframe :style="{ height: mainScrollHeight, width: '100%' }" class="frame" :src="linkAddress"
        frameborder="0"></iframe>
    </div>
    <Settings v-if="showSettings" />
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { computed, watch, ref } from 'vue';
import Sidebar from "./components/sidebar/index.vue"
import SidebarH from "./components/sidebarH/index.vue"
import Navbar from "./components/Navbar.vue"
import TagsView from "./components/tagsView/index.vue";
import Settings from "./components/Settings/index.vue"
import { useRoute } from "vue-router"
defineOptions({
  name: 'ExternalLink'
})
const route = useRoute();
const permissionStore = usePermissionStoreWithOut();
const linkAddress = ref<string | undefined>("")
// 监听当前路由
watch(
  () => route.fullPath,
  (newValue: string) => {
    const menuInfo = permissionStore.getRoutes_1d.find(item => item.path === newValue)
    linkAddress.value = menuInfo?.linkAddress
  },
  { immediate: true }
)
const appStore = useAppStoreWithOut();
const layout = computed(() => appStore.getLayout) // 左侧菜单还是顶部菜单 left top
const collapse = computed(() => appStore.getCollapse) // 菜单折叠状态
const showSettings = computed(() => appStore.getShowSettings) // 右侧配置面板展示标识
const mainScrollHeight = computed(() => {
  if (layout.value == 'left') {
    return "calc(100vh - 92px)"
  } else {
    return "calc(100vh - 102px)"
  }
})
</script>
<style scoped lang="scss">
.app-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .frame {
    width: 100%;
    height: 100%;
  }
}
</style>