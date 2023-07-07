<script lang="tsx">
import { ElTable } from 'element-plus';
import { defineComponent, PropType, ref, computed, unref, watch, onMounted, Ref } from 'vue'
import { setIndex } from './helper'
import { getSlot } from "@/utils/slot"
import common from "@/common"
import { useGridResize } from "@/utils/resize"
import { lodashSet } from "@/utils"
type TableProps = {
  // 列表高度
  tableHeight?: number,
  // 偏移位置，设置pagination
  offset?: number,
  // 是否多选
  multiSelect?: boolean
  // 是否需要单选
  singleSelect?: boolean
  // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
  showOverflowTooltip?: boolean
  // 表头
  schema?: TableColumn[]
  // 分页
  showPagination?: boolean | undefined
  // 列表总数
  total?: number | undefined
  // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
  reserveSelection?: boolean
  // 加载状态
  loading?: boolean
  // 是否叠加索引
  reserveIndex?: boolean
  data?: Recordable
  expand?: boolean
  // 是否需要根据页面resize调整列表高度
  autoResize?: boolean
} & Recordable
export default defineComponent({
  name: 'Table',
  props: {
    tableHeight: {
      type: Number,
      default: 400,
    },
    offset: {
      type: Number,
      default: 260,
    },
    // 是否多选
    multiSelect: {
      type: Boolean,
      default: false,
    },
    // 是否需要单选
    singleSelect: {
      type: Boolean,
      default: false,
    },
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    // 表头
    schema: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // 展开行
    expand: {
      type: Boolean,
      default: false,
    },
    // 是否展示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否叠加索引
    reserveIndex: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    autoResize: {
      type: Boolean,
      default: false
    }
  },
  emits: ['currentChange', 'sizeChange', 'sortChange', 'register'],
  setup(props, { attrs, slots, emit, expose }) {
    // tableHeight 初始列表高度，后续会随着resize改变自动调整
    // offset是整个页面高度-offset=tabelHeight，可以一点点试，调整到满意的值为止
    const tableHeight = ref<number>(props.tableHeight);
    props.autoResize && useGridResize(tableHeight, props.offset)
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })
    const mergeProps = ref<TableProps>({})
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })
    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }
    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { schema } = unref(getProps)
      for (const v of columnsChildren || schema) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            lodashSet(v, item.path, item.value)
            // v[item.path] = item.value
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }
    const selections = ref<Recordable[]>([])
    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection
    }
    const currentRow = ref<Recordable>({})
    const selectChange = (row: Recordable) => {
      currentRow.value = row
    }
    const sortChange = (data: Recordable) => {
      emit("sortChange", data)
    }
    expose({
      setProps,
      setColumn,
      selections,
      currentRow,
    })
    const pageSizeRef = ref<number>(common.pageSizes[0])
    const currentPageRef = ref<number>(1)
    const pagination = computed(() => {
      return {
        background: true,
        layout: common.pageLayout,
        pageSizes: common.pageSizes,
        total: unref(getProps).total
      }
    })
    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('sizeChange', val)
      }
    )
    watch(
      () => currentPageRef.value,
      (val: number) => {
        currentPageRef.value = val
        emit('currentChange', val)
      }
    )
    // 挂到el-table上的属性
    const getBindValue = computed(() => {
      const delKeys = ['schema', 'data', 'tableHeight', 'offset', 'total', 'showPagination']
      const bindValue: Recordable = { ...attrs, ...props }
      for (const key in bindValue) {
        if (delKeys.indexOf(key) !== -1) {
          delete bindValue[key]
        }
      }
      return bindValue
    })
    // 渲染多选
    const renderTableSelection = () => {
      const { multiSelect, reserveSelection } = unref(getProps)
      return multiSelect ? (
        <el-table-column
          type="selection"
          reserveSelection={reserveSelection}
          width="50"
        ></el-table-column>
      ) : undefined
    }
    // 渲染展开行
    const renderTableExpand = () => {
      const { expand } = unref(getProps)
      return expand ? (
        <el-table-column type="expand">
          {{
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </el-table-column>
      ) : undefined
    }
    // 渲染树形表格子节点
    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <el-table-column
            showOverflowTooltip={showOverflowTooltip}
            {...props}
            prop={v.field}
          >
            {{
              default: (data: TableSlotDefault) =>
                v.children && v.children.length
                  ? renderTableColumn(v.children)
                  :
                  getSlot(slots, v.field, data) ||
                  v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                  data.row[v.field],
              header: getSlot(slots, `${v.field}-header`)
            }}
          </el-table-column>
        )
      })
    }
    // 渲染el-table-column
    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        schema,
        reserveIndex,
        showOverflowTooltip
      } = unref(getProps)
      const pageSize = unref(pageSizeRef)
      const currentPage = unref(currentPageRef)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || schema).map((v) => {
          // type index项生成序号列，规定必须在props schema中第一项
          if (v.type === 'index') {
            return (
              <el-table-column
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                }
                align="center"
                label={v.label}
                width="65px"
              ></el-table-column>
            )
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            // formatter  row, column, value, index
            return (
              <el-table-column
                showOverflowTooltip={showOverflowTooltip}
                {...props}
                prop={v.field}
              >
                {{
                  default: (data: TableSlotDefault) =>
                    v.children && v.children.length
                      ? renderTreeTableColumn(v.children)
                      :
                      getSlot(slots, v.field, data) ||
                      v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                      data.row[v.field],
                  header: () => getSlot(slots, `${v.field}-header`) || v.label
                }}
              </el-table-column>
            )
          }
        })
      )
    }
    const multiSelect = unref(getProps).multiSelect
    const singleSelect = unref(getProps).singleSelect
    return () => (
      <div v-loading={unref(getProps).loading}>
        <el-table
          stripe
          fit
          ref={elTableRef}
          data={unref(getProps).data}
          height={tableHeight.value}
          highlight-current-row={singleSelect}
          onCurrent-change={singleSelect ? selectChange : false}
          onSelection-change={multiSelect ? selectionChange : false}
          onSort-change={sortChange}
          {...unref(getBindValue)}
        >
          {{
            default: () => renderTableColumn(),
            append: () => getSlot(slots, 'append')
          }}
        </el-table>
        {unref(getProps).showPagination ? (
          <el-pagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            class="pagination"
            {...unref(pagination)}
          ></el-pagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
}
</style>