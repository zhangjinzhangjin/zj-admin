<template>
  <div class="ub ub-ac" :title="title">
    <svg-icon :icon-class="icon" class="menuIcon" v-if="!isNest && icon && icon.length"></svg-icon>
    <span class="v-menu__title">{{ title as string }}</span>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: "Item"
})
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  isNest: {
    type: Boolean,
    default: false
  }
});
const { icon, title } = props
</script>
<style scoped></style>