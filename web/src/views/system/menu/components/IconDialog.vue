<template>
  <Dialog v-model="dialogVisible" title="选择图标" icon="search1" width="900px" height="400px" @closeDialog="closeDialog">
    <div class="grid">
      <div v-for="item of svgIcons" :key="item" @click="chooseIcon(item)">
        <div class="icon-item">
          <svg-icon :icon-class="item" class="disabled"></svg-icon>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "@/components/Dialog/index.vue"
import svgIcons from '@/views/icons/svg-icons'
import { ref } from 'vue';
defineOptions({
  name: "IconDialog"
})
const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {
    visible: false,
  }
)
const emit = defineEmits(['update:visible', 'chooseIcon'])
const dialogVisible = ref(true)
const closeDialog = () => {
  emit('update:visible', false)
}
const chooseIcon = (item) => {
  emit("chooseIcon", item)
  emit('update:visible', false)
}
</script>
<style lang="scss" scoped>
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
</style>
