<template>
  <el-dialog v-bind="getBindValue" :fullscreen="isFullscreen" destroy-on-close lock-scroll draggable :close-on-click-modal="false"
    :append-to-body="true" :width="dialogWidth" :before-close="closeDialog">
    <template #header>
      <table class="headerLine">
        <tr>
          <td>
            <svg-icon v-if="iconType=='svg'" class="dialogTitleIcon" :icon-class="icon" />
            <el-icon class="dialogTitleIcon" v-else><component :is="icon" /></el-icon>
            <span>{{ title }}</span>
          </td>
          <td align="right">
            <svg-icon class="fullscreenIcon" :icon-class="isFullscreen ? 'exit-fullscreen' : 'full-screen'"
              @click="toggleFull" />
          </td>
        </tr>
      </table>
    </template>
    <el-scrollbar :style="{ height: dialogHeight }">
      <slot />
    </el-scrollbar>
    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import useFullscreen from "@/utils/fullScreen"
import { isNumber } from '@/utils/is';
defineOptions({
  name: "Dialog"
})
const emit = defineEmits(['closeDialog'])
interface propsType {
  title: string
  width?: number | string
  height?: number | string
  icon?: string,
  iconType?: "svg" | "element",
  modelValue: boolean,
}
const slots = useSlots()
const props = withDefaults(defineProps<propsType>(), {
  title: "未设置标题",
  width: "500px",
  height: "300px",
  icon: "icon", // icon: "Warning", iconType: "element",
  iconType: "svg",
  modelValue: false,
})
const width = isNumber(props.width) ? `${props.width}px` : props.width
const dialogWidth = ref<string>(width)
const height = isNumber(props.height) ? `${props.height}px` : props.height
const dialogHeight = ref<string>(height)
const { isFullscreen, toggleFull, setFullscreenWatch } = useFullscreen();
// 设置窗口高度
setFullscreenWatch(dialogHeight, dialogHeight.value)
const closeDialog = () => {
  isFullscreen.value = false;
  emit('closeDialog')
}
const getBindValue = computed(() => {
  const delArr: string[] = ['title', 'height', 'icon', 'iconType']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})
</script>
<style scoped lang="scss"></style>