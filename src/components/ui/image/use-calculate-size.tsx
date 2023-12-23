import { useCallback, useReducer } from 'react'

import { calculateDimensions } from '~/lib/image'

const initialState = { height: 0, width: 0 }
type Action = { type: 'set'; height: number; width: number } | { type: 'reset' }
export const useCalculateNaturalSize = () => {
  const [state, dispatch] = useReducer(
    (state: typeof initialState, payload: Action) => {
      switch (payload.type) {
        case 'set':
          return {
            height: payload.height,
            width: payload.width,
          }
        case 'reset':
          return initialState
        default:
          return state
      }
    },
    initialState,
  )

  const calculateOnImageEl = useCallback(
    (imageEl: HTMLImageElement, parentElWidth?: number) => {
      if (!parentElWidth || !imageEl) {
        return
      }

      const w = imageEl.naturalWidth,
        h = imageEl.naturalHeight
      if (w && h) {
        const calculated = calculateDimensions({
          width: w,
          height: h,
          max: {
            height: Infinity,
            width: +parentElWidth,
          },
        })

        dispatch({
          type: 'set',
          height: calculated.height,
          width: calculated.width,
        })
      }
    },
    [],
  )

  return [state, calculateOnImageEl] as const
}
