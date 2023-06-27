declare type LayoutType = 'top' | 'left'
declare interface AppState {
  param: object,
  collapse: boolean
  locale: string
  logo: boolean
  greyMode: boolean
  layout: LayoutType
  title: string
  size: ElememtPlusSize
  theme: string,
  primaryColor: string,
  navHeadBgColor: string,
  showSettings: boolean
}
