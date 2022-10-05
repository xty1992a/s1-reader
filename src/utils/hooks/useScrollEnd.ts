import {ref} from 'vue'
import debounce from 'lodash/debounce'
import Taro, {usePageScroll} from '@tarojs/taro'
export function useScrollEnd(fn: (payload: Taro.PageScrollObject) => void) {
  const notice = debounce(position => {
    fn(position)
  }, 200)
  usePageScroll(notice)
}
