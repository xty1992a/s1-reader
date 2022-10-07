import pick from "lodash/pick";
import {inject, reactive} from "vue";

interface Option {
  enablePageScroll?: boolean
}
export function useTouchMove(option: Option) {
  const ipage = inject<any>('__i-page-component')

  const staticState = reactive({
    x: 0,
    y: 0,
  })

  const onStart = e => {
    const log = (...args) => console.log('[start]', ...args)
    log('event', e);
    const [point] = e.touches
    if (point) {
      staticState.x = point.clientX
      staticState.y = point.clientY
    }

    // if (!e.target?.dataset?.id) return

    ipage?.stopPageScroll()
    // state.current = state.children.findIndex(it => it.id === e.target.dataset.id)
    // state.currentId = e.target.dataset.id
    // log(state.current)
    // state.children.forEach(({invoke}) => {
    //   invoke({
    //     current: state.currentId,
    //     type: 'start',
    //     position: pick(staticState, ['x', 'y']),
    //     delta: pick(staticState, ['x', 'y']),
    //   })
    // })
  };

  const onMove = e => {
    const [point] = e.touches
    const log = (...args) => console.log('[move]', ...args)

    if (point) {
      const deltaX = point.clientX - staticState.x
      const deltaY = point.clientY - staticState.y
      // log('delta', deltaY, deltaX)

      // state.children.forEach(({invoke}) => invoke({
      //   id: state.currentId,
      //   type: 'move',
      //   position: {x: point.clientX, y: point.clientY},
      //   delta: {x: deltaX, y: deltaY}
      // }))
    }
    // log(e)
  }
  const onEnd = e => {
    const [point] = e.touches
    console.log('enable scroll')
    ipage?.enablePageScroll()
        // state.children.forEach(({invoke}) => invoke({
    //   id: state.currentId,
    //   type: 'end',
    //   position: {x: point?.clientX, y: point?.clientY},
    //   delta: {x: 0, y: 0}
    // }))

  }
}
