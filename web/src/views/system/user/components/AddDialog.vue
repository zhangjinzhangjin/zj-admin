<template>
  <el-dialog :fullscreen="isFullscreen" destroy-on-close lock-scroll draggable :close-on-click-modal="false"
    :append-to-body="true" v-model="visible" :before-close="closeDialog" width="500px">
    <template #header>
      <table class="headerLine">
        <tr>
          <td>
            <svg-icon class="dialogTitleIcon" :icon-class="operateType == 'add' ? 'add' : 'edit'" />
            <span>{{ title }}</span>
          </td>
          <td align="right">
            <svg-icon class="fullscreenIcon" :icon-class="isFullscreen ? 'exit-fullscreen' : 'full-screen'"
              @click="toggleFull" />
          </td>
        </tr>
      </table>
    </template>
    <el-scrollbar :style="{ height: dialogHeight }">
      <el-form :model="formData" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="operateType == 'edit'" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option v-for="item in sexArray" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色">
            <el-option v-for="item in roleListArray" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {
  FormRules,
  FormInstance
} from 'element-plus'
import { ref, toRefs, reactive, unref } from 'vue'
import {
  addUser,
  updateUser,
} from "@/api/system/user";
import useFullscreen from "@/utils/fullScreen"
import { deepClone } from '@/utils/deepClone';
import common from '@/common';
const { isFullscreen, toggleFull, setFullscreenWatch } = useFullscreen();
// 设置窗口高度
const dialogHeight = ref('250px')
setFullscreenWatch(dialogHeight, dialogHeight.value)
defineOptions({
  name: "AddUserDialog"
})
const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
    sData: object
    roleListArray: any[]
    operateType: string
  }>(),
  {
    visible: false,
    title: '',
    operateType: 'add',
    sData: () => ({
      id: "",
      createAt: "",
      name: '',
      role: '',
      mobile: "",
      sex: "-1"
    })
  }
)
const emit = defineEmits(['update:visible', 'submitDone'])
const { title, visible, sData, operateType, roleListArray } = toRefs(props)
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不可为空', trigger: ['change'] },
  ],
  name: [
    { required: true, message: '姓名不可为空', trigger: ['change'] },
    { min: 1, max: 3, message: '长度1到3', trigger: 'change' }
  ],
  role: [
    { required: true, message: '角色不可为空', trigger: ['change'] },
  ]
})
const formData = reactive({
  _id: "",
  createAt: "",
  name: '',
  username: '',
  role: '',
  mobile: "",
  sex: -1
})
Object.keys(sData.value).forEach((key) => {
  formData[key] = sData.value[key]
})
const formRef = ref<FormInstance>()
const sexArray = reactive([
  { value: "-1", label: "请选择" },
  { value: "0", label: "男" },
  { value: "1", label: "女" },
])
const closeDialog = () => {
  isFullscreen.value = false;
  emit('update:visible', false)
}
const submit = () => {
  let payload = deepClone(unref(formData))
  let id = payload._id
  delete payload._id
  formRef.value?.validate(async (valid) => {
    if (valid) {
      let res;
      let message: string;
      if (operateType.value == "add") {
        message = "添加用户成功"
        res = await addUser(payload)
      } else {
        message = "修改用户成功"
        res = await updateUser(id, payload)
      }
      if (res.code == 200) {
        common.tip(message)
        emit('submitDone')
        closeDialog()
      }
    } else {
      return false
    }
  })
}

</script>
<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-select {
    width: 100%;
  }
}
</style>