<template>
  <div>
    <el-tooltip placement="top">
      <template #content> {{ isFullscreen ? "退出全屏" : "全屏" }} </template>
      <svg-icon
        class="svg-icon"
        :icon-class="isFullscreen ? 'exit-fullscreen' : 'full-screen'"
        @click="toggleFullscreen"
    /></el-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
defineOptions({
  name: "ScreenFull"
})
const { toggle, isFullscreen } = useFullscreen()
const toggleFullscreen = () => {
  toggle()
}
</script>

<style scoped>
.svg-icon {
  font-size: 20px;
}
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
