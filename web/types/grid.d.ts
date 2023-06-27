declare type AlignName =
  | "left"
  | "center"
  | "right";
declare type GridColumn = {
  prop: string
  label: string
  width?: string | number,
  sortable?: boolean,
  align?: AlignName
}