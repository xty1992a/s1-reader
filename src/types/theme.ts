export interface ThemeConfig {
  bgColor: string

  fontColor: string
  fontSizeExtra:  number,
  fontSizeLarge: number,
  fontSizeNormal: number,
  fontSizeSmall: number,
  fontSizeMin: number,

  activeColor: string
  deactiveColor: string

  quoteBgColor: string
  quoteBorderColor: string

  [p: string]: string | number
}
