import {theme} from '@/types'

export const baseUrl = 'https://bbs.saraba1st.com'
export const tabbarArray = [
  {
    pagePath: 'pages/home/index',
    selectedIconPath: "post",
    iconPath: "post-o",
    text: '帖子'
  },
  {
    pagePath: 'pages/my/index',
    selectedIconPath: "my",
    iconPath: "my-o",
    text: '我的'
  },
]

export const homePath = tabbarArray[0].pagePath
export const settingPath = '/subpack/setting/index'
export const postDetailPath = '/subpack/post-detail/index'

export const tabbarList = tabbarArray.map(it => ({
  pagePath: it.pagePath,
  text: it.text
}))

export const THEME: theme.ThemeConfig = {
  // 背景颜色
  bgColorDarken: '#D1D9C1',
  bgColor:  '#F6F7EB',
  bgColorLighten:  '#f9f9f9',

  // 字体颜色
  fontColorDarken: '#000',
  fontColor:  '#333',
  fontColorLighten: '#666',
  fontColorGray: '#999',

  // 边框颜色
  borderColor: '#e5e5e5',

  quoteBorderColor: '#022C80',
  quoteBgColor: '#f9f9f9',

  // 状态颜色
  activeColor:  '#022C80',
  unactiveColor:  '#7d7e80',

  // 字号
  fontSizeExtra:  18,
  fontSizeLarge: 16,
  fontSizeNormal: 14,
  fontSizeSmall: 12,
  fontSizeMini: 10,

  // 边距
  pagePadding: 12,
  cardPadding: 6,
  cardMarginBottom: 10,


}
