<template>
  <div class="searchFields">
    <el-row :gutter="20">
      <el-col v-for="item in schema" :key="item.field" :span="item.span ? item.span : 3">
        <template v-if="item.component == 'Input'">
          <el-input class="searchField" v-model="searchFields[item.field]" :placeholder="item.label" />
        </template>
        <template v-else-if="item.component == 'DatePicker'">
          <el-date-picker class="searchField" v-model="searchFields[item.field]" type="date" :placeholder="item.label"
            :value-format="item.extendProps ? (item.extendProps.format ? item.extendProps.format : 'YYYY-MM-DD') : 'YYYY-MM-DD'" />
        </template>
        <template v-else-if="item.component == 'TimePicker'">
          <el-time-picker class="searchField" v-model="searchFields[item.field]" arrow-control
            :placeholder="item.label" />
        </template>
        <template v-else-if="item.component == 'Select'">
          <el-select class="searchField" v-model="searchFields[item.field]" :placeholder="item.label">
            <template v-if="item.extendProps && item.extendProps.options">
              <el-option v-for="option in item.extendProps.options" :key="option.value" :label="option.label"
                :value="option.value">
              </el-option>
            </template>
          </el-select>
        </template>
      </el-col>
      <el-col :span="defaultSlots ? defaultSlots.length * 2 + 3 : 6">
        <el-button type="primary" @click="search" v-waves>
          <svg-icon icon-class="search1" />
          <span style="margin-left: 10px">搜索</span>
        </el-button>
        <el-button type="primary" plain @click="reset" v-waves>
          <el-icon>
            <component is="Refresh" />
          </el-icon>
          <span style="margin-left: 10px">重置</span>
        </el-button>
        <slot />
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, unref, useSlots } from 'vue';
defineOptions({
  name: "SearchFields"
})
const props = withDefaults(defineProps<{ schema: SearchFieldSchema[] }>(), {
  schema: () => []
})
const emit = defineEmits(['search'])
const { schema } = props
const searchFields = reactive({})
const search = () => {
  emit("search", unref(searchFields))
}
const slots = useSlots();
const defaultSlots = slots.default && slots.default()
const reset = () => {
  schema.forEach(item => {
    searchFields[item.field] = item.value ? item.value : ""
  })
}
onMounted(() => {
  reset();
})
</script>
<style scoped lang="scss">
.searchFields {
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;

  :deep(.searchField) {
    min-width: 150px;
    width: 100%;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>