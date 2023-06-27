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
      <el-scrollbar :style="{height: mainScrollHeight}" ref="mainScroll">
        <app-main></app-main>
      </el-scrollbar>
    </div>
    <Settings v-if="showSettings" />
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { computed } from 'vue';
import Sidebar from "./components/sidebar/index.vue"
import SidebarH from "./components/sidebarH/index.vue"
import Navbar from "./components/Navbar.vue"
import TagsView from "./components/tagsView/index.vue";
import AppMain from "./components/AppMain.vue"
import Settings from "./components/Settings/index.vue"
defineOptions({
  name: 'Layout'
})
const appStore = useAppStoreWithOut();
const layout = computed(() => appStore.getLayout) // 左侧菜单还是顶部菜单 left top
const collapse = computed(() => appStore.getCollapse) // 菜单折叠状态
const showSettings = computed(() => appStore.getShowSettings) // 右侧配置面板展示标识
const mainScrollHeight = computed(() => {
  if(layout.value == 'left'){
    return "calc(100vh - 92px)"
  }else{
    return "calc(100vh - 102px)"
  }
})
</script>
<style scoped lang="scss">
.app-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>