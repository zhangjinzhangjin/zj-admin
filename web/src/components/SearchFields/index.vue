<template>
  <div class="searchFields">
    <el-row :gutter="20">
      <el-col v-for="item in schema" :key="item.field" :span="item.span ? item.span : 4" class="ub ub-ac">
        <div v-if="showLabel" class="label" :style="{ width: item.labelWidth ? item.labelWidth : '100px' }">{{ item.label }}</div>
        <!-- 自定义字段只作展示，数据需要在自己页面内处理，只要匹配到就优先渲染自定义内容，不再额外处理 -->
        <template v-if="slots[item.field]">
          <slot :name="item.field" />
        </template>
        <template v-else-if="item.component == 'Input'">
          <el-input class="searchField" v-model="searchFields[item.field]"
            :placeholder="item.placeholder ? item.placeholder : '请填写' + item.label" clearable />
        </template>
        <template v-else-if="item.component == 'DatePicker'">
          <el-date-picker class="searchField" v-model="searchFields[item.field]" type="date"
            :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label" clearable
            :value-format="item.extendProps ? (item.extendProps.format ? item.extendProps.format : 'YYYY-MM-DD') : 'YYYY-MM-DD'" />
        </template>
        <template v-else-if="item.component == 'DateRange'">
          <el-date-picker class="searchField" v-model="searchFields[item.field]" type="daterange"
            :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label" clearable unlink-panels
            :value-format="item.extendProps ? (item.extendProps.format ? item.extendProps.format : 'YYYY-MM-DD') : 'YYYY-MM-DD'" />
        </template>
        <template v-else-if="item.component == 'TimePicker'">
          <el-time-picker class="searchField" v-model="searchFields[item.field]" arrow-control
            :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label" clearable />
        </template>
        <template v-else-if="item.component == 'Select'">
          <el-select class="searchField" v-model="searchFields[item.field]"
            :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label" clearable filterable>
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
const props = withDefaults(defineProps<{ schema: SearchFieldSchema[], showLabel?: boolean }>(), {
  schema: () => [],
  showLabel: true,
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
    if (!slots[item.field]) {
      searchFields[item.field] = item.value ? item.value : ""
    }
  })
}
onMounted(() => {
  reset();
})
</script>
<style scoped lang="scss">
.searchFields {
  border-bottom: 1px solid #cccccc;

  .el-col {
    margin-bottom: 10px;
  }

  .label {
    font-size: 14px;
    text-align: right;
    padding-right: 10px;
  }

  :deep(.searchField) {
    flex: 1;
  }
}
</style>