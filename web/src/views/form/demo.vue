<template>
  <div class="wrapper">
    <Form :schema="schema" label-width="auto" label-position="right" ref="formRef">
      <!-- 字段直接匹配上就不处理直接展示 -->
      <template #field0>
        <div style="color: rgb(255, 71, 172);background: #dddddd;padding: 0px 20px;">123</div>
      </template>
      <template #field3-error>
        <div>123</div>
      </template>
      <template #field2-label>
        <div>插槽label</div>
      </template>
      <template #field4-prefix>
        <svg-icon icon-class="add" />
      </template>
      <template #field4-suffix>
        <svg-icon icon-class="right" />
      </template>
      <template #field5-prepend> Http:// </template>
      <template #field5-append> .com </template>
      <template #field9-default="{ item }">
        <div class="value">{{ item.value }}</div>
        <span class="link">{{ item.link }}</span>
      </template>
      <template #field15-option="{ item }">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
          {{ item.value }}
        </span>
      </template>
      <template #field17-option="{ item }">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
          {{ item.value }}
        </span>
      </template>
      <template #field20-default="{ item }">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
          {{ item.value }}
        </span>
      </template>
      <template #field22-default="{ item }">
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
          {{ item.value }}
        </span>
      </template>
      <template #field25-default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
      <template #field36-default="{ option }">
        <span>{{ option.value }} - {{ option.desc }}</span>
      </template>
      <template #field55-default="cell">
        <div class="cell" :class="{ current: cell.isCurrent }">
          <span class="text">{{ cell.text }}</span>
          <span v-if="isHoliday(cell)" class="holiday"></span>
        </div>
      </template>
    </Form>
  </div>
</template>
<script setup lang="ts">
import Form from '@/components/Form/index.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { useElementIcon, useIcon } from '@/components/SvgIcon'
import common from "@/common"
const restaurants = ref<Recordable[]>([])
const querySearch = (queryString: string, cb: Fn) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: Recordable) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const handleSelect = (item: Recordable) => {
  console.log(item)
}
onMounted(() => {
  restaurants.value = [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' }
  ]
})
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const options = ref<ComponentOptions[]>(
  Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`
  }))
)
const options2 = ref<ComponentOptions[]>(
  Array.from({ length: 10 }).map((_, idx) => {
    const label = idx + 1
    return {
      value: `Group ${label}`,
      label: `Group ${label}`,
      options: Array.from({ length: 10 }).map((_, idx) => ({
        value: `Option ${idx + 1 + 10 * label}`,
        label: `${initials[idx % 10]}${idx + 1 + 10 * label}`
      }))
    }
  })
)
const options3: ComponentOptions[] = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout'
          },
          {
            value: 'color',
            label: 'Color'
          },
          {
            value: 'typography',
            label: 'Typography'
          },
          {
            value: 'icon',
            label: 'Icon'
          },
          {
            value: 'button',
            label: 'Button'
          }
        ]
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio'
          },
          {
            value: 'checkbox',
            label: 'Checkbox'
          },
          {
            value: 'input',
            label: 'Input'
          },
          {
            value: 'input-number',
            label: 'InputNumber'
          },
          {
            value: 'select',
            label: 'Select'
          },
          {
            value: 'cascader',
            label: 'Cascader'
          },
          {
            value: 'switch',
            label: 'Switch'
          },
          {
            value: 'slider',
            label: 'Slider'
          },
          {
            value: 'time-picker',
            label: 'TimePicker'
          },
          {
            value: 'date-picker',
            label: 'DatePicker'
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker'
          },
          {
            value: 'upload',
            label: 'Upload'
          },
          {
            value: 'rate',
            label: 'Rate'
          },
          {
            value: 'form',
            label: 'Form'
          }
        ]
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table'
          },
          {
            value: 'tag',
            label: 'Tag'
          },
          {
            value: 'progress',
            label: 'Progress'
          },
          {
            value: 'tree',
            label: 'Tree'
          },
          {
            value: 'pagination',
            label: 'Pagination'
          },
          {
            value: 'badge',
            label: 'Badge'
          }
        ]
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert'
          },
          {
            value: 'loading',
            label: 'Loading'
          },
          {
            value: 'message',
            label: 'Message'
          },
          {
            value: 'message-box',
            label: 'MessageBox'
          },
          {
            value: 'notification',
            label: 'Notification'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu'
          },
          {
            value: 'tabs',
            label: 'Tabs'
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb'
          },
          {
            value: 'dropdown',
            label: 'Dropdown'
          },
          {
            value: 'steps',
            label: 'Steps'
          }
        ]
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog'
          },
          {
            value: 'tooltip',
            label: 'Tooltip'
          },
          {
            value: 'popover',
            label: 'Popover'
          },
          {
            value: 'card',
            label: 'Card'
          },
          {
            value: 'carousel',
            label: 'Carousel'
          },
          {
            value: 'collapse',
            label: 'Collapse'
          }
        ]
      }
    ]
  }
]
const generateData = () => {
  const data: {
    value: number
    desc: string
    disabled: boolean
  }[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      value: i,
      desc: `Option ${i}`,
      disabled: i % 4 === 0
    })
  }
  return data
}
const holidays = [
  '2021-10-01',
  '2021-10-02',
  '2021-10-03',
  '2021-10-04',
  '2021-10-05',
  '2021-10-06',
  '2021-10-07'
]
const isHoliday = ({ dayjs }) => {
  return holidays.includes(dayjs.format('YYYY-MM-DD'))
}
const handleClick = () => {
  common.tip("自定义事件", "success")
}
const schema = reactive<FormSchema[]>([
  {
    field: 'field0',
    label: "自定义template",
  },
  {
    field: 'field1',
    label: "输入框",
    component: 'Divider'
  },
  {
    field: 'field2',
    label: "默认",
    component: 'Input',
    componentProps: {
      onClick: handleClick
    }
  },
  {
    field: 'field3',
    label: `图标1`,
    component: 'Input',
    labelMessage: "666",
    componentProps: {
      // suffixIcon: useIcon({ iconClass: '403' }),
      suffixIcon: useElementIcon({ iconName: "Aim" }),
      prefixIcon: useIcon({ iconClass: '404' })
    },
  },
  {
    field: 'field4',
    label: `图标2`,
    component: 'Input',
    componentProps: {
      slots: {
        suffix: true,
        prefix: true
      }
    }
  },
  {
    field: 'field5',
    label: "复合型",
    component: 'Input',
    componentProps: {
      slots: {
        prepend: true,
        append: true
      }
    }
  },
  {
    field: 'field6',
    label: "文本域",
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 1
    }
  },
  {
    field: 'field7',
    label: "自动补全",
    component: 'Divider'
  },
  {
    field: 'field8',
    label: "默认",
    component: 'Autocomplete',
    componentProps: {
      fetchSuggestions: querySearch,
      onSelect: handleSelect
    }
  },
  {
    field: 'field9',
    label: "插槽",
    component: 'Autocomplete',
    componentProps: {
      fetchSuggestions: querySearch,
      onSelect: handleSelect,
      slots: {
        default: true
      }
    }
  },
  {
    field: 'field10',
    component: 'Divider',
    label: "数字"
  },
  {
    field: 'field11',
    label: "默认",
    component: 'InputNumber',
    value: 0
  },
  {
    field: 'field12',
    label: "位置",
    component: 'InputNumber',
    componentProps: {
      controlsPosition: 'right'
    },
    value: 0
  },
  {
    field: 'field13',
    label: "下拉选择",
    component: 'Divider'
  },
  {
    field: 'field14',
    label: "默认",
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'field15',
    label: "插槽",
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      optionsSlot: true
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'field16',
    label: "选项分组",
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'option1',
          options: [
            {
              label: 'option1-1',
              value: '1-1'
            },
            {
              label: 'option1-2',
              value: '1-2'
            }
          ]
        },
        {
          label: 'option2',
          options: [
            {
              label: 'option2-1',
              value: '2-1'
            },
            {
              label: 'option2-2',
              value: '2-2'
            }
          ]
        }
      ]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'field17',
    label: `分组插槽`,
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'option1',
          options: [
            {
              label: 'option1-1',
              value: '1-1'
            },
            {
              label: 'option1-2',
              value: '1-2'
            }
          ]
        },
        {
          label: 'option2',
          options: [
            {
              label: 'option2-1',
              value: '2-1'
            },
            {
              label: 'option2-2',
              value: '2-2'
            }
          ]
        }
      ],
      optionsSlot: true
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'field18',
    label: `虚拟列表下拉选择`,
    component: 'Divider'
  },
  {
    field: 'field19',
    label: "默认",
    component: 'SelectV2',
    componentProps: {
      options: options.value
    }
  },
  {
    field: 'field20',
    label: "插槽",
    component: 'SelectV2',
    componentProps: {
      options: options.value,
      slots: {
        default: true
      }
    }
  },
  {
    field: 'field21',
    label: "选项分组",
    component: 'SelectV2',
    componentProps: {
      options: options2.value
    }
  },
  {
    field: 'field22',
    label: `分组插槽`,
    component: 'SelectV2',
    componentProps: {
      options: options2.value,
      slots: {
        default: true
      }
    }
  },
  {
    field: 'field23',
    label: "级联选择器",
    component: 'Divider'
  },
  {
    field: 'field24',
    label: "默认",
    component: 'Cascader',
    componentProps: {
      options: options3
    }
  },
  {
    field: 'field25',
    label: "插槽",
    component: 'Cascader',
    componentProps: {
      options: options3,
      slots: {
        default: true
      }
    }
  },
  {
    field: 'field26',
    label: "开关",
    component: 'Divider'
  },
  {
    field: 'field27',
    label: "默认",
    component: 'Switch',
    value: false
  },
  {
    field: 'field28',
    label: "图标",
    component: 'Switch',
    value: false,
    componentProps: {
      activeIcon: useIcon({ iconClass: '500' }),
      inactiveIcon: useIcon({ iconClass: 'add' })
    }
  },
  {
    field: 'field29',
    label: "评分",
    component: 'Divider'
  },
  {
    field: 'field30',
    label: "默认",
    component: 'Rate',
    value: null
  },
  {
    field: 'field31',
    label: "图标",
    component: 'Rate',
    value: null,
    componentProps: {
      voidIcon: useIcon({ iconClass: 'delete' }),
      icons: [
        useIcon({ iconClass: 'edit' }),
        useIcon({ iconClass: 'nav-left' }),
        useIcon({ iconClass: 'nav-top' })
      ]
    }
  },
  {
    field: 'field32',
    label: "颜色",
    component: 'Divider'
  },
  {
    field: 'field33',
    label: "默认",
    component: 'ColorPicker'
  },
  {
    field: 'field34',
    label: "穿梭框",
    component: 'Divider'
  },
  {
    field: 'field35',
    label: "默认",
    component: 'Transfer',
    componentProps: {
      props: {
        key: 'value',
        label: 'desc',
        disabled: 'disabled'
      },
      data: generateData()
    },
    value: [],
    colProps: {
      span: 24
    }
  },
  {
    field: 'field36',
    label: "插槽",
    component: 'Transfer',
    componentProps: {
      props: {
        key: 'value',
        label: 'desc',
        disabled: 'disabled'
      },
      leftDefaultChecked: [2, 3],
      rightDefaultChecked: [1],
      data: generateData(),
      slots: {
        default: true
      }
    },
    value: [1],
    colProps: {
      span: 24
    }
  },
  {
    field: 'field37',
    label: `渲染器`,
    component: 'Transfer',
    componentProps: {
      props: {
        key: 'value',
        label: 'desc',
        disabled: 'disabled'
      },
      leftDefaultChecked: [2, 3],
      rightDefaultChecked: [1],
      data: generateData(),
      renderContent: (h: Fn, option: Recordable) => {
        return h('span', null, `${option.value} - ${option.desc}`)
      }
    },
    value: [1],
    colProps: {
      span: 24
    }
  },
  {
    field: 'field38',
    label: "单选框",
    component: 'Divider'
  },
  {
    field: 'field39',
    label: "默认",
    component: 'Radio',
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1'
        },
        {
          label: 'option-2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'field40',
    label: "按钮",
    component: 'RadioButton',
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1'
        },
        {
          label: 'option-2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'field41',
    label: "复选框",
    component: 'Divider'
  },
  {
    field: 'field42',
    label: "默认",
    component: 'Checkbox',
    value: [],
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1'
        },
        {
          label: 'option-2',
          value: '2'
        },
        {
          label: 'option-3',
          value: '23'
        }
      ]
    }
  },
  {
    field: 'field43',
    label: "按钮",
    component: 'CheckboxButton',
    value: [],
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1'
        },
        {
          label: 'option-2',
          value: '2'
        },
        {
          label: 'option-3',
          value: '23'
        }
      ]
    }
  },
  {
    field: 'field44',
    component: 'Divider',
    label: "滑块"
  },
  {
    field: 'field45',
    component: 'Slider',
    label: "默认",
    value: 0
  },
  {
    field: 'field46',
    component: 'Divider',
    label: "日期选择"
  },
  {
    field: 'field47',
    component: 'DatePicker',
    label: "默认",
    componentProps: {
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    }
  },
  {
    field: 'field48',
    component: 'DatePicker',
    label: "快捷选项",
    componentProps: {
      type: 'date',
      disabledDate: (time: Date) => {
        return time.getTime() > Date.now()
      },
      shortcuts: [
        {
          text: "今天",
          value: new Date()
        },
        {
          text: "昨天",
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          }
        },
        {
          text: "一周前",
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          }
        }
      ]
    }
  },
  {
    field: 'field49',
    component: 'DatePicker',
    label: "周",
    componentProps: {
      type: 'week',
      format: `[周] ww`
    }
  },
  {
    field: 'field50',
    component: 'DatePicker',
    label: "年",
    componentProps: {
      type: 'year'
    }
  },
  {
    field: 'field51',
    component: 'DatePicker',
    label: "月",
    componentProps: {
      type: 'month'
    }
  },
  {
    field: 'field52',
    component: 'DatePicker',
    label: "日期",
    componentProps: {
      type: 'dates'
    }
  },
  {
    field: 'field53',
    component: 'DatePicker',
    label: "日期范围",
    componentProps: {
      type: 'daterange'
    }
  },
  {
    field: 'field54',
    component: 'DatePicker',
    label: "月份范围",
    componentProps: {
      type: 'monthrange'
    }
  },
  {
    field: 'field55',
    component: 'DatePicker',
    label: "插槽",
    componentProps: {
      type: 'date',
      format: 'YYYY/MM/DD',
      valueFormat: 'YYYY-MM-DD',
      slots: {
        default: true
      }
    }
  },
  {
    field: 'field56',
    component: 'Divider',
    label: "日期时间选择器"
  },
  {
    field: 'field57',
    component: 'DatePicker',
    label: "默认",
    componentProps: {
      type: 'datetime',
      valueFormat: "YYYY-MM-DD"
    }
  },
  {
    field: 'field58',
    component: 'DatePicker',
    label: "快捷选项",
    componentProps: {
      type: 'datetime',
      shortcuts: [
        {
          text: "今天",
          value: new Date()
        },
        {
          text: "昨天",
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          }
        },
        {
          text: "上周",
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          }
        }
      ]
    }
  },
  {
    field: 'field59',
    component: 'DatePicker',
    label: "日期时间范围",
    componentProps: {
      type: 'datetimerange'
    }
  },
  {
    field: 'field60',
    component: 'Divider',
    label: "时间选择器"
  },
  {
    field: 'field61',
    component: 'TimePicker',
    label: "默认"
  },
  {
    field: 'field62',
    component: 'Divider',
    label: "时间选择"
  },
  {
    field: 'field63',
    component: 'TimeSelect',
    label: "默认"
  },
  {
    field: 'field64',
    component: 'Divider',
    label: "富文本"
  },
  {
    field: 'field65',
    component: 'Editor',
    label: "编辑器",
    value: "<p>123</p>",
    colProps: {
      span: 24
    }
  },
  {
    field: 'field66',
    component: 'Divider',
    label: "文件"
  },
  {
    field: 'field67',
    component: 'Upload',
    label: "编辑模式",
    value: "64a76e2c6bc77c2b24f956a3",
    componentProps: {
      type: 'edit',
      allowFormat: "docx",
      // size: 0.01, // 10k
      limit: 3, // 最多3个文件
    }
  },
  {
    field: 'field68',
    component: 'Upload',
    label: "查看模式",
    value: "64a76d41f9b8f6040cb93291,64a76d936bc77c2b24f956a2",
    componentProps: {
      type: 'view',
    }
  },
])
const formRef = ref<Component>(null);
const formModel = computed(() => {
  return formRef.value.formModel
})
</script>
<style lang="scss" scoped>
.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;

  .text {
    position: absolute;
    left: 50%;
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 auto;
    line-height: 24px;
    border-radius: 50%;
    transform: translateX(-50%);
  }

  &.current {
    .text {
      color: #fff;
      background: purple;
    }
  }

  .holiday {
    position: absolute;
    bottom: 0px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    transform: translateX(-50%);
  }
}
</style>
