export interface ThemeConfig {
  bgColorDarken: string;
  bgColor: string;
  bgColorLighten: string;
  fontColorDarken: string;
  fontColor: string;
  fontColorLighten: string;
  fontColorGray: string;
  borderColor: string;
  quoteBorderColor: string;
  quoteBgColor: string;
  activeColor: string;
  unactiveColor: string;

  fontSizeExtra: number;
  fontSizeLarge: number;
  fontSizeNormal: number;
  fontSizeSmall: number;
  fontSizeMini: number;
  pagePadding: number;
  cardPadding: number;
  cardMarginBottom: number;

  [p: string]: string | number;
}
