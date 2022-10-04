import type {App} from 'vue'
import {Icon} from '@nutui/nutui-taro'
const Iconfont = ({
  name: 'Iconfont',
  props: {
    name: String
  },
  render() {
    return <Icon name={this.name} classPrefix="icon" fontClassName="iconfont"/>
  },
  install: (app: App) => {
    app.component(Iconfont.name, Iconfont)
  }
})

export default Iconfont
