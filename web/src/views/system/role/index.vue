<template>
  <div class="wrapper">
    <SearchFields @search="search" :schema="searchFieldsSchema">
      <el-button type="warning" @click="openAddDialog">
        <svg-icon icon-class="add" />
        <span style="margin-left: 10px">添加</span>
      </el-button>
    </SearchFields>
    <Table :schema="tableColumnsSchema" autoResize :data="tableData" :loading="loading" :total="paginationParams.total"
      @currentChange="handleCurrentChange" @sizeChange="handleSizeChange" @sortChange="handleSortChange"
      :tableHeight="400" :offset="240" ref="tableRef">
      <!-- 只要slot和field匹配上，就展示template内容 -->
      <template #action="scope">
        <el-link class="editIcon" :underline="false" @click="openViewDialog(scope.row)">查看</el-link>
        <el-link class="editIcon" :underline="false" @click="openEditDialog(scope.row)">编辑</el-link>
        <el-link class="deleteIcon" :underline="false" @click="deleteOne(scope.row)">删除</el-link>
        <el-link v-if="scope.row.code != 'admin'" class="permissionIcon" :underline="false"
          @click="openPermissionDialog(scope.row)">权限配置</el-link>
      </template>
    </Table>
    <AddDialog v-model:visible="dialogVisible" :sData="dialogData" :title="dialogTitle" v-if="dialogVisible"
      @submit-done="getList" :operateType="operateType" />
    <PermissionDialog v-model:visible="permissionDialogVisible" v-if="permissionDialogVisible" @submit-done="getList"
      :routes="routes" :currentRowId="currentRowId" />
  </div>
</template>
<script lang="ts" setup>
import SearchFields from "@/components/SearchFields/index.vue"
import { onMounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import AddDialog from './components/AddDialog.vue'
import PermissionDialog from './components/PermissionDialog.vue'
import common from "@/common"
import Table from '@/components/Table/index.vue'
import {
  getAllRoutes,
  getRoles,
  deleteRole,
} from "@/api/system/role";
defineOptions({
  name: "ProductList"
})
const searchFieldsSchema = reactive<SearchFieldSchema[]>([
  {
    field: 'code',
    label: "角色编码",
    component: 'Input',
  },
  {
    field: 'label',
    label: "角色名称",
    component: 'Input',
  },
])
const searchFields = reactive({
  code: "",
  label: ""
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
    field: 'code',
    label: '角色编码',
    width: 200,
    sortable: true,
  },
  {
    field: 'label',
    label: '角色名称',
    width: 200,
    sortable: true,
  },
  {
    field: 'desc',
    label: "描述",
    align: "center"
  },
  {
    field: 'action',
    label: "操作",
    width: 250,
  }
]
const loading = ref(true)
const tableData: Ref<any[]> = ref([])
const getList = async () => {
  loading.value = true
  const params = { ...searchFields, pageNo: paginationParams.pageNo, pageSize: paginationParams.pageSize, orderName: sortParams.orderName, orderDir: sortParams.orderDir }
  const res = await getRoles(params)
  tableData.value = res.data.list
  paginationParams.total = res.data.total
  loading.value = false
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
  _id: "",
  code: '',
  label: '',
  desc: ""
})
const openAddDialog = () => {
  dialogTitle.value = '添加角色'
  operateType.value = 'add'
  Object.keys(dialogData).forEach((key) => {
    dialogData[key] = ''
  })
  dialogVisible.value = true
}
const openEditDialog = (data) => {
  dialogTitle.value = '编辑角色'
  operateType.value = 'edit'
  Object.keys(dialogData).forEach((key) => {
    dialogData[key] = data[key]
  })
  dialogVisible.value = true
}
const openViewDialog = (data) => {
  dialogTitle.value = '查看角色'
  operateType.value = 'view'
  Object.keys(dialogData).forEach((key) => {
    dialogData[key] = data[key]
  })
  dialogVisible.value = true
}
const deleteOne = (row) => {
  common.confirm(`确定删除角色 ${row.label} 吗?此操作不可恢复！`, () => {
    deleteRole(row._id).then(() => {
      getList();
      common.tip("删除成功");
    });
  })
}
// 权限树设置
const currentRowId = ref("")
const permissionDialogVisible: Ref<boolean> = ref(false)
const routes = ref<any[]>([]);
const openPermissionDialog = (data) => {
  currentRowId.value = data._id
  routes.value = data.routes // 只有id
  permissionDialogVisible.value = true
}
</script>
<style lang="scss" scoped>
.wrapper {
  .editIcon {
    color: #409eff;
    margin-right: 10px;
  }

  .deleteIcon {
    color: #f56c6c;
    margin-right: 10px;
  }

  .permissionIcon {
    color: darkorange;
  }
}
</style>