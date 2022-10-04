import {ref, provide} from 'vue'
import {toHex, toRgb} from "@/utils";


export function useColor(id: string) {
  const visible = ref(false)
  const color = ref<string>('rgb(255,255,255)')
  const resolve = ref((payload: any) => {
  })

  const pickColor = (rgbText: string) => {
  console.log('pick', rgbText)
   return new Promise<{color: string, success: boolean}>(_resolve => {
     visible.value = true
     color.value = toRgb(rgbText)
     console.log(color.value)
     resolve.value = (payload: {color: string, success: boolean}) => {
       console.log('resolve', payload)
       visible.value = false
       _resolve(payload)
     }
   })
  }

  provide(id, {
    color,
    visible,
    resolve,
  })

  return [pickColor]
}
