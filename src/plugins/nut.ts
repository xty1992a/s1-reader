import type {App} from 'vue'
import {
  Badge, Button, Cell,
  Col, Ellipsis, Icon,
  Row, Tabbar, TabbarItem,
  Tag, Toast, Divider,
  ConfigProvider,
  Form, FormItem,
  CellGroup,InputNumber,
  Collapse,CollapseItem,
  Picker,Popup,OverLay,
} from "@nutui/nutui-taro";
import local from './local'
const list = [
  Badge, Button, Cell,
  Col, Ellipsis, Icon,
  Row, Tabbar, TabbarItem,
  Tag, Toast, Divider,
  ConfigProvider,
  Form, FormItem,
  CellGroup,InputNumber,
  Collapse,CollapseItem,
  Picker, Popup,OverLay,
]
function useNut(app: App) {
  list.forEach(comp => app.use(comp))
  app.use(local)
}

export default {
  install: useNut
}
