<template>
  <div class="wrapper">
    <SearchFields @search="search" :schema="searchFieldsSchema">
      <!-- 只能是按钮，展示在搜索重置后面，想另起一行展示就写Se4archFields外面 -->
      <el-button type="warning" @click="openAddDialog">
        <svg-icon icon-class="add" />
        <span style="margin-left: 10px">添加</span>
      </el-button>
    </SearchFields>
    <Table :schema="tableColumnsSchema" autoResize :data="tableData" :loading="loading" :total="paginationParams.total"
      @currentChange="handleCurrentChange" @sizeChange="handleSizeChange" @sortChange="handleSortChange"
      :tableHeight="400" :offset="240" multiSelect singleSelect ref="tableRef">
      <!-- 只要slot和field匹配上，就展示template内容 -->
      <template #action="scope">
        <span title="编辑" style="cursor: pointer" @click="openEditDialog(scope.row)">
          <svg-icon class="editIcon" icon-class="edit" />
        </span>
        <span title="删除" style="cursor: pointer" @click="deleteOne(scope.$index)">
          <svg-icon class="deleteIcon" icon-class="delete" />
        </span>
      </template>
    </Table>
    <AddDialog v-model:visible="dialogVisible" :sData="dialogData" :title="dialogTitle" v-if="dialogVisible"
      @submit-done="submitDone" :operateType="operateType" />
  </div>
</template>
<script lang="tsx" setup>
import SearchFields from "@/components/SearchFields/index.vue"
import { onMounted, reactive, ref, unref, h, computed } from 'vue'
import type { Ref } from 'vue'
import AddDialog from './components/AddDialog.vue'
import common from "@/common"
import Table from '@/components/Table/index.vue'
import { ElTag } from "element-plus"
defineOptions({
  name: "ProductList"
})
// options array init
const typeArray = reactive<OptionProp[]>([
  { value: "0", label: "办公用品" },
  { value: "1", label: "生活用品" },
])
// searchFields模型
const searchFieldsSchema = reactive<SearchFieldSchema[]>([
  {
    field: 'name',
    label: "产品名称",
    component: 'Input',
  },
  {
    field: 'type',
    label: "产品类型",
    component: 'Select',
    value: "1",
    extendProps: {
      options: unref(typeArray)
    }
  },
])
// 具体的搜索param，默认值要和schema保持一致，也可以用函数赋值
const searchFields = reactive({
  name: "",
  type: "1"
})
// 搜索面板点击搜索时触发事件
const search = (params: object) => {
  Object.keys(params).forEach(key => {
    searchFields[key] = params[key]
  })
  getList();
}
// 列表模型
const tableColumnsSchema: TableColumn[] = [
  {
    field: 'index',
    label: "序号",
    type: 'index'
  },
  {
    field: 'name',
    label: '姓名',
    width: 200,
    sortable: true,
  },
  {
    // 可以直接formatter里render vNode, 也可以在formatter里写jsx,上面script lang标记成tsx即可
    // 也可以直接在Table里写<template #type="scope"><div>{{scope.row.type}}</div></template>
    field: 'type',
    label: '产品类型',
    width: 150,
    sortable: true,
    // row, column, value, index
    formatter: (row: Recordable, column: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue == "1" ? 'success' : 'warning'
        },
        () => typeArray.find(item => item.value == cellValue)?.label
      )
      // return (
      //   <div>123456 </div>
      // )
    }
  },
  {
    field: 'desp',
    label: "描述",
    align: "center"
  },
  {
    field: 'action',
    label: "操作",
    width: 200,
  }
]
const loading = ref(true)
// 返回的列表数据
interface tableDataObj {
  id: string
  createAt?: string
  name?: string
  type?: string
  desp?: string
}
const tableData: Ref<tableDataObj[]> = ref([])
const getList = () => {
  loading.value = true
  const params = { ...searchFields, pageNo: paginationParams.pageNo, pageSize: paginationParams.pageSize, orderName: sortParams.orderName, orderDir: sortParams.orderDir }
  console.log(params)
  const sData = [
    {
      id: 0,
      createAt: '2016-05-03',
      name: '产品1',
      type: "0",
      desp: "产品1的描述"
    },
    {
      id: 1,
      createAt: '2016-04-03',
      name: '产品2',
      type: "1",
      desp: "产品2的描述"
    },
  ]
  const res = JSON.parse(JSON.stringify(sData))
  setTimeout(() => {
    tableData.value = res
    paginationParams.total = res.length
    loading.value = false
  }, 1000)
}
// 基础params
const paginationParams = reactive({
  pageNo: 1,
  pageSize: common.pageSizes[0],
  total: 0
})
const handleCurrentChange = (num) => {
  paginationParams.pageNo = num
  getList()
}
const handleSizeChange = (size) => {
  paginationParams.pageNo = 1
  paginationParams.pageSize = size
  getList()
}
const sortParams = reactive({
  orderName: "",
  orderDir: ""
});
const handleSortChange = (data) => {
  const { prop, order } = data;
  sortParams.orderName = prop;
  sortParams.orderDir = order;
  if (order) {
    getList();
  } else {
    sortParams.orderName = "";
    sortParams.orderDir = "";
    getList();
  }
}
onMounted(() => {
  getList()
})
const dialogVisible: Ref<boolean> = ref(false)
const dialogTitle = ref<string>('')
const operateType = ref<string>('')
// dialog用到的字段及回显值
const dialogData = reactive({
  id: "",
  createAt: "",
  name: '',
  type: '',
  desp: ""
})
const openAddDialog = () => {
  dialogTitle.value = '添加一个'
  operateType.value = 'add'
  Object.keys(dialogData).forEach((key) => {
    dialogData[key] = ''
  })
  dialogVisible.value = true
}
const openEditDialog = (data) => {
  dialogTitle.value = '编辑一个'
  operateType.value = 'edit'
  Object.keys(dialogData).forEach((key) => {
    dialogData[key] = data[key]
  })
  dialogVisible.value = true
}
// 提交完成回来刷新列表
const submitDone = (data) => {
  if (operateType.value == 'add') {
    tableData.value.unshift(data)
  } else {
    const index = tableData.value.findIndex((item) => item.id === data.id)
    tableData.value[index] = data
  }
}
const deleteOne = (index: number) => {
  common.confirm('确定删除吗?', () => {
    tableData.value.splice(index, 1)
  })
}
// Table获取多选或者单选的数据，只有配置了multiSelect或者singleSelect才能获取到，都配置上也不冲突
const tableRef = ref<Component>(null);
const selections = computed(() => {
  return tableRef.value.selections
})
const currentRow = computed(() => {
  return tableRef.value.currentRow
})
</script>
<style lang="scss" scoped>
.wrapper {
  .editIcon {
    color: #409eff;
    margin-right: 10px;
  }

  .deleteIcon {
    color: #f56c6c;
  }
}
</style>