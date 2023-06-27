<template>
  <Dialog v-model="dialogVisible" title="权限配置" icon="edit" width="600px" height="400px" @closeDialog="closeDialog">
    <el-scrollbar style="height: 400px">
      <el-tree ref="treeRef" :data="allRoutes" show-checkbox node-key="_id" defaultExpandAll
        :default-checked-keys="defaultChecktIds" :props="defaultProps" />
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "@/components/Dialog/index.vue"
import { ref, onBeforeMount } from "vue";
import {
  getAllRoutes,
  updateRole,
} from "@/api/system/role";
import { ElTree } from "element-plus";
import common from "@/common";
defineOptions({
  name: "PermissionDialog"
})
const props = defineProps<{
  currentRowId: string,
  routes: any[]
}>();
const emit = defineEmits(['update:visible', 'submitDone'])
const closeDialog = () => {
  emit('update:visible', false)
}
const dialogVisible = ref(true)
const { routes, currentRowId } = props
const defaultChecktIds = ref<string[]>([])
const allRoutes = ref<any[]>([])
onBeforeMount(async () => {
  const res = await getAllRoutes();
  allRoutes.value = res.data;
  // 因为半选的情况，所以把有子节点的一级菜单删除掉，再checknode
  routes.forEach(route => {
    if (!(allRoutes.value.find(item => item.children && item.children.length && item._id === route._id))) {
      defaultChecktIds.value.push(route._id)
    }
  })
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeRef = ref<InstanceType<typeof ElTree>>()
const submit = async () => {
  const res = treeRef.value!.getCheckedNodes(false, true);
  const checkedIds = res.map(item => item._id)
  const submitRes = await updateRole(currentRowId, { routes: checkedIds }) as any
  if (submitRes.code == 200) {
    common.tip("权限配置成功，刷新网站生效~")
    emit('submitDone')
    closeDialog()
  }
}
</script>
<style scoped></style>