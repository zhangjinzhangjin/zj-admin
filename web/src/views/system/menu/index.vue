<template>
  <div class="wrapper">
    <div class="addRootButton">
      <el-button type="warning" @click="addRoot">添加一级菜单</el-button>
    </div>
    <el-row :gutter="20" v-loading="loading">
      <el-col :span="11">
        <el-scrollbar class="treeWrapper">
          <el-tree default-expand-all :data="treeData" node-key="id" @node-drag-start="handleDragStart"
            @node-drag-end="handleDragEnd" @node-drop="handleDrop" :allow-drop="allowDrop" draggable class="menuTree">
            <template #default="{ node, data }">
              <span :class="`custom-tree-node ${data.children ? 'border' : ''}`">
                <span class="menuSpan" @click="handleClickTree(data)">
                  <svg-icon v-if="data.children" :icon-class="`${node.expanded ? 'put-away2' : 'unfold'}`" />
                  <span :class="`${data.children ? 'releft20' : ''}`"
                    style="display: inline-block; width: 100%;padding-left: 28px;">{{
                      node.label }}</span>
                </span>
                <span class="svgBtn">
                  <span v-if="data.menuType === 'folder'" title="添加">
                    <svg-icon class="add" @click.stop="addChild(data)" icon-class="add" />
                  </span>
                  <span title="删除">
                    <svg-icon class="del" @click.stop="removeOne(data)" icon-class="delete" />
                  </span>
                </span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-divider direction="vertical" style="height: auto;"></el-divider>
      <el-col :span="12">
        <el-scrollbar class="formWrapper">
          <Form @register="register" :isCol="false" :rules="rules">
          </Form>
          <div class="ub ub-ac ub-pc">
            <el-button type="primary" size="default" @click="saveOne">保存</el-button>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <IconDialog v-model:visible="iconDialogVisible" v-if="iconDialogVisible" @chooseIcon="chooseIcon" />
  </div>
</template>
<script setup lang="ts">
import { deepClone } from "@/utils/deepClone"
import { Ref, onBeforeMount, reactive, ref } from 'vue';
import Form from "@/components/Form/index.vue"
import { useForm } from "@/components/Form/useForm"
import common from "@/common";
import { addMenu, updateMenu, getMenuList, deleteMenu, sortMenu } from "@/api/system/menu"
import { FormRules, TreeNode } from 'element-plus'
import { useIcon } from "@/components/SvgIcon";
import IconDialog from './components/IconDialog.vue'
import { useValidator } from '@/utils/validator'
const { required } = useValidator()
// 设置图标选择窗口
const iconDialogVisible: Ref<boolean> = ref(false)
const chooseIcon = (item) => {
  methods.setValues({
    icon: item
  })
}
const openIconDialog = () => {
  iconDialogVisible.value = true;
}
const allMenuTypeArray: OptionProp[] = [
  { label: "文件夹", value: "folder" },
  { label: "静态菜单", value: "static" },
  { label: "动态菜单", value: "dynamic" },
  { label: "外部链接", value: "externalLink" },
]
const menuTypeArray: Ref<OptionProp[]> = ref(deepClone(allMenuTypeArray));
const rules = reactive<FormRules>({
  menuKey: [required()],
  label: [required()],
  path: [required()]
})
// 选择菜单类型时，控制字段显示
const changeMenuType = (menuType) => {
  const componentSchema = schema.find(item => item.field === "component") as any;
  const dynamicPageSchema = schema.find(item => item.field === "dynamicPage") as any;
  const linkAddressSchema = schema.find(item => item.field === "linkAddress") as any;
  const aliveNameSchema = schema.find(item => item.field === "aliveName") as any;
  if (menuType == "folder") {
    componentSchema.hidden = true;
    dynamicPageSchema.hidden = true;
    linkAddressSchema.hidden = true;
    aliveNameSchema.hidden = true;
  } else if (menuType == "static") {
    componentSchema.hidden = false;
    dynamicPageSchema.hidden = true;
    linkAddressSchema.hidden = true;
    aliveNameSchema.hidden = false;
  } else if (menuType == "dynamic") {
    componentSchema.hidden = true;
    dynamicPageSchema.hidden = false;
    linkAddressSchema.hidden = true;
    aliveNameSchema.hidden = true;
  } else if (menuType == "externalLink") {
    componentSchema.hidden = true;
    dynamicPageSchema.hidden = true;
    linkAddressSchema.hidden = false;
    aliveNameSchema.hidden = true;
  }
}
// 右侧表单
const schema = reactive<FormSchema[]>([
  {
    field: 'pid',
    hidden: true,
    value: "0",
  },
  {
    field: 'pname',
    hidden: true,
    component: 'Input',
    label: "父菜单",
    value: "",
    componentProps: {
      disabled: true
    }
  },
  {
    field: "_id",
    hidden: true,
    value: ""
  },
  {
    field: 'menuKey',
    label: "菜单主键",
    component: 'Input',
    value: "",
  },
  {
    field: 'label',
    label: "菜单名称",
    component: 'Input',
    value: "",
  },
  {
    field: 'menuType',
    label: "菜单类型",
    component: 'Select',
    componentProps: {
      options: menuTypeArray.value,
      onChange: changeMenuType
    },
    value: "folder",
  },
  {
    field: 'desp',
    label: "描述",
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3
    },
    value: "",
  },
  {
    field: 'path',
    label: "路由",
    component: 'Input',
    hidden: false,
    value: "",
  },
  {
    field: 'component',
    label: "静态组件",
    component: 'Input',
    hidden: true,
    value: "",
  },
  {
    field: 'dynamicPage',
    label: "动态页面",
    component: 'Input',
    hidden: true,
    value: "",
    labelMessage: "还没做，后续会集成低代码平台，这里会做成弹出选择一个页面~",
  },
  {
    field: 'linkAddress',
    label: "链接地址",
    component: 'Input',
    hidden: true,
    value: "",
    labelMessage: "如果外部连接的地址本身有iframe安全策略限制，可以采用代理的方式中转~",
  },
  {
    field: 'icon',
    label: `图标`,
    component: 'Input',
    labelMessage: "默认只展示一级菜单图标，二级菜单不展示图标，所以二级菜单配了也没用~",
    componentProps: {
      suffixIcon: useIcon({ iconClass: 'search1' }),
      onClick: openIconDialog
    },
    value: "",
  },
  {
    field: "aliveName",
    label: `组件缓存`,
    component: 'Input',
    labelMessage: "如果需要缓存页面，则需要指定缓存名称，缓存名称与代码中组件defineOption指定的name一致时，页面才会有缓存效果。",
    hidden: true,
  },
  {
    field: 'isHide',
    label: "是否隐藏",
    component: 'Switch',
    value: false,
  }
])
const { register, methods, elFormRef } = useForm({
  schema
})
const loading = ref(false)
const treeData = ref([]);
// 拖拽排序用到的对象
const treeUpdateObj = reactive({
  id: "",
  targetId: "",
  direct: "",
});
// 排序开始
const handleDragStart = (node, ev) => {
  treeUpdateObj.id = node.data._id;
}
// 排序结束
const handleDragEnd = (draggingNode, dropNode, dropType, ev) => {
  treeUpdateObj.targetId = dropNode.data._id;
}
// 排序放置
const handleDrop = async (draggingNode, dropNode, dropType, ev) => {
  treeUpdateObj.direct = dropType;
  const res = await sortMenu(treeUpdateObj) as any
  common.tip(res.message);
  getList();
}
// 判断是否允许放置
const allowDrop = (draggingNode, dropNode, type) => {
  // inner时，拖的folder或者放的不是folder或者放的不是一级菜单
  const cond1 = type == "inner" && (draggingNode.data.menuType === "folder" || dropNode.data.menuType != "folder" || dropNode.data.pid != "0")
  // 前后排序时，拖的是一级菜单并且放的不是一级菜单
  const cond2 = type != "inner" && draggingNode.data.menuType === "folder" && dropNode.data.pid != "0"
  return !(cond1 || cond2);
}
type operationType = "addRoot" | "update" | "addChild"
const operation = ref<operationType>("addRoot")
const handleClickTree = (node) => {
  const pnameSchema = schema.find(item => item.field === "pname") as any;
  operation.value = "update"
  const clone = deepClone(allMenuTypeArray)
  // 一级菜单
  if (node.pid != '0') {
    pnameSchema.hidden = false;
    menuTypeArray.value = clone.filter(item => {
      if (item.value !== "folder") {
        return item;
      }
    })
  } else {
    pnameSchema.hidden = true
    menuTypeArray.value = clone
  }
  methods.setSchema([
    {
      field: "menuType",
      path: 'componentProps.options',
      value: menuTypeArray.value
    }
  ])
  resetForm(node)
  changeMenuType(node.menuType)
  // 设置右侧form数据
}
const resetForm = async (node?: TreeNode) => {
  const baseFormData = {
    aliveName: "",
    component: "",
    dynamicPage: "",
    desp: "",
    icon: "",
    label: "",
    linkAddress: "",
    menuKey: "",
    menuType: "folder",
    path: "",
    pid: "0",
  }
  if (node) {
    methods.setValues(node)
  } else {
    methods.setValues(deepClone(baseFormData))
  }
  setTimeout(() => {
    elFormRef.value?.clearValidate();
  }, 10);
}
const getList = async () => {
  loading.value = true;
  const res = await getMenuList();
  treeData.value = res.data;
  loading.value = false;
  // 默认显示第一条
  if (res.data.length) {
    handleClickTree(res.data[0]);
  }
}
onBeforeMount(() => {
  getList();
})
const addRoot = () => {
  const pnameSchema = schema.find(item => item.field === "pname") as any;
  operation.value = "addRoot"
  pnameSchema.hidden = true
  resetForm();
  const clone = deepClone(allMenuTypeArray)
  menuTypeArray.value = clone
  methods.setSchema([
    {
      field: "menuType",
      path: 'componentProps.options',
      value: menuTypeArray.value
    }
  ])
  methods.setValues({
    menuType: "folder"
  })
  changeMenuType("folder")
}
const addChild = (data) => {
  operation.value = "addChild"
  const pnameSchema = schema.find(item => item.field === "pname") as any;
  resetForm();
  pnameSchema.hidden = false;
  methods.setValues({
    pid: data._id,
    pname: data.label
  })
  const clone = deepClone(allMenuTypeArray)
  menuTypeArray.value = clone.filter(item => {
    if (item.value !== "folder") {
      return item;
    }
  })
  methods.setSchema([
    {
      field: "menuType",
      path: 'componentProps.options',
      value: menuTypeArray.value
    }
  ])
  methods.setValues({
    menuType: "static"
  })
  changeMenuType("static")
}
const removeOne = (data) => {
  common.confirm("确认要删除菜单" + data.label + "吗，若有子菜单也会全部删除，此操作不可恢复！！", async () => {
    const res = await deleteMenu(data._id) as any
    common.tip(res.message)
    getList();
  })
}
// 保存菜单
const saveOne = () => {
  elFormRef?.value?.validate(async (valid) => {
    if (valid) {
      let formModel = await methods.getFormData() as any;
      if (operation.value === "addRoot") {
        delete formModel._id;
        addMenu(formModel).then(res => {
          common.tip("创建一级菜单成功");
          getList();
        });
      } else if (operation.value === "addChild") {
        delete formModel._id;
        addMenu(formModel).then(res => {
          common.tip("添加子级菜单成功");
          getList();
        });
      } else if (operation.value === "update") {
        const buffer = deepClone(formModel)
        delete buffer._id;
        updateMenu(formModel._id, buffer).then(res => {
          common.tip("更新菜单成功");
          getList();
        });
      }
    } else {
      return false
    }
  })
}
</script>
<style scoped lang="scss">
.wrapper {
  .addRootButton {
    margin-bottom: 10px;
  }

  .treeWrapper,
  .formWrapper {
    height: calc(100vh - 185px);
  }

  .treeWrapper {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;

      .menuSpan {
        display: inline-block;
        width: 100%;
        height: 35px;
        line-height: 35px;

        svg {
          margin: 0px 5px;
        }
      }

      .svgBtn {
        svg {
          pointer-events: unset;
          position: unset;
          margin-right: 16px;

          &.add {
            color: #fb8929;
          }

          &.del {
            color: #f74c55;
          }
        }
      }

      .releft20 {
        left: -24px;
      }
    }

    :deep(.menuTree) {
      border-top: 1px solid #f2f2f2;

      .el-tree-node__content {
        border-bottom: 1px solid #f2f2f2;
        padding: 14px 0;
        height: 40px;

        .el-tree-node__expand-icon {
          visibility: hidden;
          margin-left: -20px;
        }
      }

      .el-tree-node__children {
        background-color: #fbfbfb;

        .el-tree-node__content {
          padding-left: 0 !important;
          margin-left: 18px;
          height: 40px;
        }

        .el-tree-node:last-child {
          border-bottom: 1px solid #f2f2f2;

          .el-tree-node__content {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>