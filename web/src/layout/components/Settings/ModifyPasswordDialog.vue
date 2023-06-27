<template>
  <el-dialog :fullscreen="isFullscreen" destroy-on-close lock-scroll draggable :close-on-click-modal="false"
    :append-to-body="true" v-model="visible" :before-close="closeDialog" width="600px">
    <template #header>
      <table class="headerLine">
        <tr>
          <td>
            <svg-icon class="dialogTitleIcon" icon-class="icon" />
            <span>修改密码</span>
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
        <el-form-item label="原密码" prop="opassword">
          <el-input v-model="formData.opassword" placeholder="请输入原密码，如果你没改过，那就是6个0" />
        </el-form-item>
        <el-form-item label="新密码" prop="npassword">
          <el-input v-model="formData.npassword" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="再次确认" prop="nnpassword">
          <el-input v-model="formData.nnpassword" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue'
import useFullscreen from "@/utils/fullScreen"
import common from "@/common/index"
import {
  FormRules,
  FormInstance
} from 'element-plus'
import { changePwd } from "@/api/system/user";
import { useUserStoreWithOut } from "@/store/modules/user"
const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {
    visible: false,
  }
)
const { visible } = toRefs(props)
const userStore = useUserStoreWithOut();
const info = computed(() => userStore.getUserInfo)
const emit = defineEmits(['update:visible'])
const { isFullscreen, toggleFull, setFullscreenWatch } = useFullscreen();
const formData = reactive({
  opassword: '',
  npassword: '',
  nnpassword: ''
})
const nnpasswordValidator = (rule, value, callback) => {
  console.log(formData.npassword, formData.nnpassword)
  if (formData.npassword != formData.nnpassword) {
    return callback(new Error("得跟上面新密码一样"));
  }
  callback();
};
const rules = reactive<FormRules>({
  opassword: [
    { required: true, message: "旧密码不能为空", trigger: "change" },
    { min: 3, message: "旧密码至少要3位", trigger: "change" }
  ],
  npassword: [
    { required: true, message: "新密码不能为空", trigger: "change" },
    { min: 3, message: "新密码至少要3位", trigger: "change" }
  ],
  nnpassword: [
    { required: true, message: "确认密码不能为空", trigger: "change" },
    { validator: nnpasswordValidator, trigger: "change" }
  ]
})
const formRef = ref<FormInstance>()
// 设置窗口高度
const dialogHeight = ref('150px')
setFullscreenWatch(dialogHeight, dialogHeight.value)
const closeDialog = () => {
  emit('update:visible', false)
}
const submit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      const param = {
        id: info.value._id,
        opassword: formData.opassword,
        npassword: formData.npassword
      };
      console.log(param)
      changePwd(param).then(async (res) => {
        common.tip("密码修改成功，请重新登录！", "success")
        await userStore.logout();
        closeDialog();
        setTimeout(() => {
          (window as any).location.reload();
        }, 2000);
      });
    } else {
      return false
    }
  })
}

</script>
<style lang="scss" scoped>
:deep(.formItem) {
  width: 100%;

  .el-input__wrapper {
    width: 100%;
  }
}
</style>