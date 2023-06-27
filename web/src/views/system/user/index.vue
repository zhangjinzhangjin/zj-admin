<template>
  <div class="wrapper">
    <div class="searchFields">
      <el-input class="searchField" v-model="searchFields.username" placeholder="请输入用户名" clearable />
      <el-input class="searchField" v-model="searchFields.name" placeholder="请输入姓名" clearable />
      <el-select class="searchField" v-model="searchFields.sex" placeholder="性别">
        <el-option v-for="item in sexArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-date-picker class="searchField" v-model="searchFields.createdAt" type="date" placeholder="请选择创建时间" />
      <el-button type="primary" @click="getList">
        <svg-icon icon-class="search1" />
        <span style="margin-left: 10px">搜索</span>
      </el-button>
      <el-button type="warning" @click="openAddDialog">
        <svg-icon icon-class="add" />
        <span style="margin-left: 10px">添加</span>
      </el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :height="tableHeight" v-loading="loading"
      @sort-change="handleSortChange">
      <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"
        :width="item.width" :sortable="item.sortable ? 'custom' : false">
        <template #default="scope">
          <div v-if="item.prop == 'sex'">
            {{ sexArray.find(sexItem => sexItem.value == scope.row.sex)?.label }}
          </div>
          <div v-else-if="item.prop == 'role'">
            {{ roleListArray.find(role => role.value == scope.row.role)?.label }}
          </div>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-link class="editIcon" :underline="false" @click="openEditDialog(scope.row)">编辑</el-link>
          <el-link class="deleteIcon" v-if="scope.row.username != 'admin'" :underline="false"
            @click="deleteOne(scope.row)">删除</el-link>
          <el-link class="resetPwdIcon" :underline="false" @click="doResetPwd(scope.row)">重置密码</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" :pageSize="searchFields.pageSize" :page-sizes="common.pageSizes"
      :currentPage="searchFields.pageNo" :layout="common.pageLayout" background :total="total"
      @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    <AddDialog v-model:visible="dialogVisible" :sData="sData" :title="dialogTitle" :roleListArray="roleListArray"
      v-if="dialogVisible" @submit-done="getList" :operateType="operateType" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, onBeforeMount } from 'vue'
import type { Ref } from 'vue'
import { useEventListener, useWindowSize } from '@vueuse/core'
import AddDialog from './components/AddDialog.vue'
import common from "@/common"
import {
  getRoles,
  getUserList,
  deleteUser,
  // deleteUsers,
  getRoutes,
  resetPwd
} from "@/api/system/user";
defineOptions({
  name: "User"
})
const sexArray = reactive([
  { value: "-1", label: "全选" },
  { value: "0", label: "男" },
  { value: "1", label: "女" },
])
const roleListArray = reactive<any[]>([])
const searchFields = reactive({
  name: '',
  username: "",
  sex: "-1",
  createdAt: '',
  orderName: '',
  orderDir: '',
  pageNo: 1,
  pageSize: common.pageSizes[0]
})
onBeforeMount(async () => {
  const res = await getRoles();
  res.data.list.forEach(item => {
    roleListArray.push({ value: item.code, label: item.label })
  })
})
// column接口
interface columnObj {
  prop: string
  label: string
  width?: string,
  sortable?: boolean
}
const columns = ref<columnObj[]>([
  {
    prop: 'username',
    label: '用户名',
    sortable: true,
  },
  {
    prop: 'name',
    label: '姓名',
    sortable: true,
  },
  {
    prop: 'mobile',
    label: '电话号码',
  },
  {
    prop: 'sex',
    label: '性别',
    sortable: true,
  },
  {
    prop: 'role',
    label: '角色',
    sortable: true,
  }
])
const tableData: Ref<any[]> = ref([])
const total = ref<number>(0)
const loading = ref(false)
const getList = async () => {
  loading.value = true
  const res = await getUserList(searchFields)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}
const handleCurrentChange = (pageNo) => {
  searchFields.pageNo = pageNo
  getList()
}
const handleSizeChange = (pageSize) => {
  searchFields.pageNo = 1
  searchFields.pageSize = pageSize
  getList()
}
const handleSortChange = (data) => {
  const { prop, order } = data;
  searchFields.orderName = prop;
  searchFields.orderDir = order;
  if (order) {
    getList();
  } else {
    searchFields.orderName = "";
    searchFields.orderDir = "";
    getList();
  }
}
const tableHeight: Ref<number> = ref(400)
const handleResize = () => {
  const { height } = useWindowSize()
  const offset = 260
  tableHeight.value = height.value - offset
}
onMounted(() => {
  getList()
  useEventListener('resize', handleResize)
  setTimeout(() => {
    handleResize()
  }, 100)
})
const dialogVisible: Ref<boolean> = ref(false)
const dialogTitle = ref<string>('')
const operateType = ref<string>('')
const openAddDialog = () => {
  dialogTitle.value = '添加用户'
  operateType.value = 'add'
  Object.keys(sData).forEach((key) => {
    sData[key] = ''
  })
  dialogVisible.value = true
}
const openEditDialog = (data) => {
  dialogTitle.value = '编辑用户'
  operateType.value = 'edit'
  Object.keys(sData).forEach((key) => {
    sData[key] = data[key]
  })
  dialogVisible.value = true
}
const sData = reactive({
  _id: "",
  name: '',
  username: "",
  role: '',
  mobile: "",
  sex: -1
})
const deleteOne = (data) => {
  common.confirm(`确定删除用户 ${data.name} 吗?此操作不可恢复！`, () => {
    deleteUser(data._id).then(() => {
      getList();
      common.tip("删除成功");
    });
  })
}
const doResetPwd = async (data) => {
  common.confirm("点击确定即可重置该用户的登录密码", () => {
    resetPwd(data._id).then(() => {
      const name = data.name
      common.tip(`这个叫${name}的用户，他的密码已经被重置为6个0了~`);
    });
  })
}
</script>
<style lang="scss" scoped>
.wrapper {
  .searchFields {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #cccccc;

    :deep(.searchField) {
      width: 150px;
      margin-right: 10px;
    }
  }

  .pagination {
    margin-top: 20px;
  }

  .editIcon {
    color: #409eff;
    margin-right: 10px;
  }

  .deleteIcon {
    color: #f56c6c;
    margin-right: 10px;
  }

  .resetPwdIcon {
    color: darkorange;
  }
}
</style>