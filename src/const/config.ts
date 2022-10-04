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
  bgColor:  '#F6F7EB',
  subBgColor: '#f0f0f0',
  fontColor:  '#333',
  subFontColor: '#999',
  borderColor: '#e5e5e5',

  fontSizeExtra:  18,
  fontSizeLarge: 16,
  fontSizeNormal: 14,
  fontSizeSmall: 12,
  fontSizeMin: 10,

  pagePadding: 12,
  cardPadding: 6,

  activeColor:  '#022C80',
  deactiveColor:  '#999',
  quoteBgColor:  '#f9f9f9',
  quoteBorderColor:  '#022C80',

}
