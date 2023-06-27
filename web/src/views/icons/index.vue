<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item))">
            <el-tooltip placement="top">
              <template #content> {{ generateIconCode(item) }} </template>
              <div class="icon-item">
                <svg-icon :icon-class="item" class="disabled"></svg-icon>
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item))">
            <el-tooltip placement="top">
              <template #content> {{ generateElementIconCode(item) }} </template>
              <div class="icon-item">
                <el-icon>
                  <component :is="item" />
                </el-icon>
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'
import common from "@/common/index";
import { unref } from 'vue';
defineOptions({
  name: 'Icons'
})
const generateIconCode = (symbol) => {
  return `<svg-icon icon-class="${symbol}" />`
}
const generateElementIconCode = (symbol) => {
  return `<el-icon><component is="${symbol}" /></el-icon>`
}
const handleClipboard = async (text) => {
  const { copy, copied, isSupported } = useClipboard({
    source: text
  })
  if (!isSupported) {
    common.tip("当前浏览器不支持拷贝,请更换浏览器", "error");
  } else {
    await copy(text)
    if (unref(copied)) {
      common.tip("拷贝成功", "success");
    }
  }
}
</script>
<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 700px;
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
