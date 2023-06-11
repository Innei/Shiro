'use client'

import { animateValue } from 'framer-motion'

import { microdampingPreset } from '~/constants/spring'

export const springScrollTo = (y: number) => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  const animation = animateValue({
    keyframes: [scrollTop, y],
    autoplay: true,
    ...microdampingPreset,
    onUpdate(latest) {
      if (latest <= 0) {
        animation.stop()
      }
      window.scrollTo(0, latest)
    },
  })
}
export const springScrollToTop = () => {
  springScrollTo(0)
}

// TODO check it
export const springScrollToElement = (element: HTMLElement, delta = 40) => {
  const y = calculateElementTop(element)
  const to = y + delta
  springScrollTo(to)
}

const calculateElementTop = (el: HTMLElement) => {
  let top = 0
  while (el) {
    top += el.offsetTop
    el = el.offsetParent as HTMLElement
  }
  return top
}
