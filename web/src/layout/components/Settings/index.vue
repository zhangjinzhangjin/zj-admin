<template>
  <div class="panelDrawer">
    <el-drawer v-model="showSettings" direction="rtl" size="300px" :with-header="false" :before-close="beforeClose"
      :destroy-on-close="true" :show-close="false" :wrapperClosable="true">
      <MainSetting v-if="mainSettingVisible" @changePanel="changePanel('layout')" @closeSetting="closeSetting" />
      <LayoutSetting v-else @changePanel="changePanel('main')" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { computed, ref } from 'vue';
import MainSetting from "./MainSetting.vue"
import LayoutSetting from "./LayoutSetting.vue"
defineOptions({
  name: "SettingsPanel"
})
const appStore = useAppStoreWithOut();
const { setShowSettings } = appStore
const showSettings = computed(() => appStore.getShowSettings) // 右侧配置面板展示标识
const beforeClose = () => {
  appStore.setShowSettings(false)
}
const mainSettingVisible = ref(true) // true主配置面板,false layout配置面板
const changePanel = (panel) => {
  mainSettingVisible.value = panel == 'main'
}
const closeSetting = () => {
  setShowSettings(false)
}
</script>
<style scoped lang="scss">
.panelDrawer {
  :deep(.el-drawer__body) {
    padding: 0px;
  }
}
</style>