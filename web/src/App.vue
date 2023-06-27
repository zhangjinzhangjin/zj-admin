<script setup lang="ts">
import { elLocaleMap } from "./i18n";
import { useAppStoreWithOut } from '@/store/modules/app'
import { computed, onMounted, watch } from "vue"
import { useWindowSize } from '@vueuse/core'
import { changeTheme, changePrimaryColor, changeNavHeadBgColor } from "@/utils/themeSet"
const appStore = useAppStoreWithOut();
const locale: string = appStore.getLocale;
const size: ElememtPlusSize = appStore.getSize;
const grayMode = computed(() => appStore.getGreyMode)
const initTheme = () => {
  const {getTheme, getPrimaryColor, getNavHeadBgColor} = appStore
  changeTheme(getTheme)
  changePrimaryColor(getPrimaryColor)
  changeNavHeadBgColor(getNavHeadBgColor)
}
onMounted(() => {
  // 初始化系统主题设置
  initTheme();
})
const { width } = useWindowSize()
// 监听窗口变化
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      appStore.setCollapse(true)
    }
  },
  {
    immediate: true
  }
)
</script>
<template>
  <ElConfigProvider :locale="elLocaleMap[locale]" :size="size">
    <RouterView :class="grayMode ? `greyMode` : ''" />
  </ElConfigProvider>
</template>
<style scoped lang="scss">
.greyMode {
  filter: grayscale(100%);
}
</style>
