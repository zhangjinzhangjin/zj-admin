<template>
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
  <a href="to" v-if="isExternal(to)" target='_blank' rel='noopener'>
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>
<script setup lang="ts">
defineOptions(
  {
    name: "AppLink"
  }
)
const props = defineProps({
  to: {
    type: String,
    required: true
  }
});
const isExternal = function (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
const { to } = props
const linkProps = (url) => {
  if (isExternal(url)) {
    return {
      is: 'a',
      href: url,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    is: 'router-link',
    to: url
  }
}
</script>
<style scoped></style>