declare type TableColumn = {
  field: string
  label?: string
  children?: TableColumn[]
} & Recordable
declare type PaginationProps = {
  pageNo: number
  pageSize: number
  total: number
}
declare type SortProps = {
  orderName: string
  orderDir: string
}
declare type TableSlotDefault = {
  row: Recordable
  column: TableColumn
  $index: number
} & Recordable
declare interface TableSetPropsType {
  field: string
  path: string
  value: any
}
