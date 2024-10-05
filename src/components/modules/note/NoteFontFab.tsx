'use client'

import { useAtomValue } from 'jotai'
import { atomWithStorage, selectAtom } from 'jotai/utils'
import { useEffect, useMemo } from 'react'

import { MotionButtonBase } from '~/components/ui/button'
import { FABPortable } from '~/components/ui/fab'
import { FloatPanel } from '~/components/ui/float-panel'
import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'
import { clsxm } from '~/lib/helper'
import { loadStyleSheet } from '~/lib/load-script'
import { Noop } from '~/lib/noop'
import { jotaiStore } from '~/lib/store'

type Font = 'serif' | 'sans' | 'youzai' | 'lxgw'
const fontAtom = atomWithStorage<Font>('note-font', 'serif')

export const NoteFontSettingFab = () => {
  return (
    <>
      <FloatPanel
        triggerElement={
          <FABPortable onClick={Noop}>
            <i className="i-mingcute-font-line" />
          </FABPortable>
        }
      >
        <main>
          <div className="mb-4 text-lg font-medium">字形选择</div>
          <div className="grid w-[200px] grid-cols-2 grid-rows-2 gap-4">
            <FontItem type="serif">
              <SerifFontSvg />
            </FontItem>

            <FontItem type="sans">
              <SansFont />
            </FontItem>

            <FontItem type="lxgw">
              <LXGWFontSvg />
            </FontItem>

            <FontItem type="youzai">
              <YouZaiFontSvg />
            </FontItem>
          </div>
        </main>
      </FloatPanel>
      <FontAdjust />
    </>
  )
}

const FONT_CONFIG = {
  youzai: {
    stylesheetUrl:
      'https://fastly.jsdelivr.net/gh/Innei/static@master/fonts/yozai/stylesheet.css',
    fontFamily: `'Yozai', 'LXGW WenKai Screen R', var(--font-sans), var(--font-serif), system-ui`,
  },
  sans: {
    fontFamily: `var(--font-sans), system-ui`,
  },
  lxgw: {
    stylesheetUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/lxgwwenkaiscreenr.css',
    fontFamily: `'LXGW WenKai Screen R', Yozai, var(--font-sans), var(--font-serif), system-ui`,
  },
}

function loadAndApplyFont(
  config: (typeof FONT_CONFIG)[keyof typeof FONT_CONFIG],
) {
  if ('stylesheetUrl' in config && config.stylesheetUrl) {
    loadStyleSheet(config.stylesheetUrl)
  }

  const $style = document.createElement('style')
  $style.innerHTML = `#${MAIN_MARKDOWN_ID} { font-family: ${config.fontFamily};`
  document.head.append($style)

  return () => {
    document.head.removeChild($style)
  }
}

const FontAdjust = () => {
  const currentFont = useAtomValue(fontAtom)

  useEffect(() => {
    const config = (FONT_CONFIG as any)[currentFont]
    if (config) {
      return loadAndApplyFont(config)
    }
  }, [currentFont])
  return null
}

const FontItem: Component<{
  type: Font
}> = ({ children, type }) => {
  const isSelected = useAtomValue(
    useMemo(
      () =>
        selectAtom(fontAtom, (value) => {
          return value === type
        }),
      [type],
    ),
  )
  return (
    <MotionButtonBase
      className={clsxm(
        'flex aspect-square select-none rounded-lg ring-1 ring-slate-100 center dark:ring-neutral-800',
        'duration-200',
        isSelected && '!ring-accent',
      )}
      onClick={() => {
        jotaiStore.set(fontAtom, type)
      }}
    >
      {children}
    </MotionButtonBase>
  )
}

export const SansFont = () => {
  return <span className="font-sans text-[30px]">字</span>
}

export const YouZaiFontSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 17"
      className="size-[1em] text-[30px]"
    >
      <path
        fill="currentColor"
        d="M1.9 9.8L1.9 9.8Q1.8 9.8 1.7 9.7Q1.6 9.6 1.6 9.5Q1.5 9.5 1.5 9.4L1.5 9.4Q1.7 8.7 2.0 8.0Q2.3 7.4 2.5 6.7L2.5 6.7L2.5 6.4Q2.5 6.2 2.8 6.1L2.8 6.1L8.0 5.6Q7.7 5.1 7.4 4.6Q7.2 4.1 7.0 3.5L7.0 3.5Q7.0 3.5 7.0 3.4L7.0 3.4Q7.2 3.3 7.3 3.2L7.3 3.2L7.5 3.2Q8.1 3.7 8.5 4.7L8.5 4.7Q8.6 4.9 8.7 5.0Q8.7 5.2 8.7 5.3L8.7 5.3L8.7 5.6Q9.5 5.6 11.4 5.3L11.4 5.3Q12.7 5.1 14.0 5.0L14.0 5.0L14.1 5.0L14.4 5.0Q14.6 5.1 14.7 5.3L14.7 5.3L14.7 5.5Q14.4 6.2 14.1 6.9Q13.9 7.6 13.5 8.3L13.5 8.3Q13.3 8.4 13.1 8.4L13.1 8.4Q12.8 8.3 12.8 8.1L12.8 8.1L12.8 7.8L13.5 6.0L13.2 6.0Q10.7 6.3 8.3 6.5Q5.8 6.7 3.4 6.9L3.4 6.9Q2.9 8.5 2.2 9.7L2.2 9.7Q2.1 9.8 1.9 9.8ZM8.0 17.4L8.0 17.4L7.8 17.4Q7.1 17.1 6.3 16.9Q5.5 16.6 4.8 16.2L4.8 16.2L4.7 15.9L4.9 15.5Q5.0 15.5 5.3 15.5L5.3 15.5Q5.9 15.7 6.6 16.0L6.6 16.0Q7.2 16.2 7.9 16.5L7.9 16.5Q8.0 16.4 8.1 16.3Q8.2 16.2 8.3 16.1L8.3 16.1Q9.0 15.2 9.0 13.4L9.0 13.4Q9.0 13.0 8.9 12.6L8.9 12.6Q7.0 12.8 5.1 12.9Q3.3 13.0 1.4 13.3L1.4 13.3Q1.2 13.2 1.1 13.0L1.1 13.0L1.1 12.7L1.4 12.4Q3.2 12.2 5.0 12.1Q6.8 11.9 8.5 11.8L8.5 11.8L8.6 11.7L8.3 11.0Q8.1 10.5 7.5 10.1L7.5 10.1Q7.3 10.0 7.2 9.8L7.2 9.8Q7.2 9.4 7.5 9.3L7.5 9.3L7.8 9.3L8.5 9.7Q8.9 9.4 9.2 9.0Q9.6 8.6 10.1 8.4L10.1 8.4L9.9 8.4Q9.1 8.5 4.4 9.4L4.4 9.4L4.0 9.2Q4.0 9.1 4.0 8.8L4.0 8.8Q4 8.6 4.2 8.5L4.2 8.5Q4.4 8.5 8.0 7.8L8.0 7.8Q9.9 7.4 11.7 7.3L11.7 7.3Q11.8 7.3 11.9 7.4Q12.0 7.5 12.1 7.6L12.1 7.6L12.1 7.8Q11.3 8.5 10.6 9.1Q9.8 9.7 9.0 10.4L9.0 10.4Q9.4 11.2 9.6 11.7L9.6 11.7L10.1 11.7Q12.7 11.3 14.5 11.3L14.5 11.3Q14.7 11.3 14.8 11.6L14.8 11.6L14.8 11.8Q14.7 12.1 14.5 12.1L14.5 12.1Q13.0 12.2 9.8 12.6L9.8 12.6L9.9 13.9Q9.8 14.8 9.6 15.6Q9.3 16.4 8.6 17.0L8.6 17.0Q8.6 17.1 8.3 17.3L8.3 17.3Q8.1 17.4 8.0 17.4Z "
      />
    </svg>
  )
}
export const LXGWFontSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 17"
      className="size-[1em] text-[30px]"
    >
      <path
        fill="currentColor"
        d="M13.4 5.4L3.5 5.9Q2.7 8.1 2.4 8.3L2.4 8.3Q2.3 8.4 2.3 8.4Q2.2 8.4 2.0 8.3L2.0 8.3Q1.5 8.1 1.5 7.9L1.5 7.9Q1.5 7.8 2.0 6.9Q2.4 6.1 3.0 4.5L3.0 4.5Q3.1 4.1 3.3 4.1L3.3 4.1Q3.4 4.1 3.6 4.2L3.6 4.2Q4.0 4.3 4.0 4.5L4.0 4.5Q4.0 4.6 3.9 4.7L3.9 4.7L3.8 5.0L7.5 4.8L7.4 3.5Q7.4 3.2 7.3 3.0Q7.1 2.8 7.1 2.7L7.1 2.7Q7.1 2.6 7.3 2.6Q7.5 2.6 7.8 2.7L7.8 2.7Q8.5 2.8 8.5 3.1L8.5 3.1L8.5 4.8L13.9 4.5L14 4.5Q14.3 4.5 14.5 4.6Q14.8 4.8 14.8 5.0Q14.8 5.1 14.6 5.2Q14.5 5.3 14.5 5.4Q14.4 5.5 14.3 5.7L14.3 5.7Q12.9 7.8 12.5 7.8L12.5 7.8Q12.4 7.8 12.4 7.6Q12.4 7.5 12.7 6.9Q13.0 6.3 13.4 5.4L13.4 5.4ZM4.2 7.4L4.2 7.4L4.8 7.5L5.0 7.5Q5.1 7.5 5.2 7.5L5.2 7.5L10.7 7.1Q10.8 7.1 10.8 7.1L10.8 7.1L10.9 7.1Q11.4 7.1 11.7 7.5L11.7 7.5Q11.8 7.7 11.8 7.8Q11.8 7.9 11.6 8.0Q11.5 8.1 11.4 8.2L11.4 8.2Q9.9 9.7 8.5 10.6L8.5 10.6L8.7 11.2L13.3 11.0Q13.9 11.0 14.0 10.9Q14.2 10.9 14.2 10.9Q14.3 10.9 14.5 11.0L14.5 11.0Q15.2 11.4 15.2 11.7L15.2 11.7Q15.2 11.9 14.7 11.9L14.7 11.9L8.9 12.1Q9.0 12.8 9.1 14.2L9.1 14.2L9.1 14.4Q9.1 16.8 8.4 17.2L8.4 17.2Q8.2 17.3 8.1 17.3Q7.9 17.3 7.2 16.9Q6.6 16.6 5.6 15.8Q4.7 15.1 4.7 14.9L4.7 14.9Q4.7 14.8 4.8 14.8Q5.0 14.8 5.3 14.9L5.3 14.9Q6.4 15.5 7.1 15.8Q7.8 16.0 7.9 16.0Q7.9 16.0 8.0 15.5Q8.0 15.1 8.0 14.1Q8.0 13.1 7.9 12.2L7.9 12.2L2.4 12.4L1.9 12.4Q1.6 12.4 1.5 12.3L1.5 12.3Q1.1 11.7 1.1 11.6Q1.1 11.4 1.1 11.4Q1.2 11.4 1.4 11.5Q1.6 11.5 1.9 11.5L1.9 11.5L2.1 11.5L7.7 11.3Q7.5 10.7 7.3 10.3Q7.1 9.9 7.1 9.8Q7.1 9.6 7.3 9.5Q7.5 9.4 7.7 9.4Q7.9 9.4 8.1 9.8L8.1 9.8Q9.6 8.8 10.2 8.1L10.2 8.1L5.5 8.4Q5.2 8.5 4.9 8.5Q4.7 8.5 4.5 8.3Q4.3 8.1 4.2 7.8Q4.0 7.6 4.0 7.6L4.0 7.6Q4.0 7.4 4.2 7.4Z "
      />
    </svg>
  )
}

export const SerifFontSvg = () => {
  return (
    <svg
      viewBox="0 0 90.7 91"
      xmlns="http://www.w3.org/2000/svg"
      className="size-[1em] text-[30px]"
    >
      <g
        id="svgGroup"
        strokeLinecap="round"
        fillRule="evenodd"
        fontSize="9pt"
        stroke="#000"
        strokeWidth="0.25mm"
        fill="#000"
        className="fill-current stroke-current stroke-[0.25mm]"
      >
        <path
          d="M 78.1 53.6 L 47.3 53.6 L 47.3 45.3 C 49.6 44.9 50.6 44.1 50.9 42.7 L 50.1 42.6 C 57 39.8 64 35.6 69 32.2 A 25.716 25.716 0 0 0 70.202 32.116 C 71.1 32.028 71.791 31.886 72.339 31.628 A 2.815 2.815 0 0 0 73 31.2 L 66.3 25 L 62.6 28.7 L 18.1 28.7 L 18.9 31.7 L 61 31.7 A 73.299 73.299 0 0 1 58.771 33.833 C 55.539 36.803 51.555 39.971 47.7 42.3 L 42.9 41.7 L 42.9 53.6 L 0 53.6 L 0.9 56.6 L 42.9 56.6 L 42.9 82.8 A 4.349 4.349 0 0 1 42.826 83.666 C 42.612 84.71 41.894 85.1 40.2 85.1 C 38.052 85.1 27.614 84.402 26.248 84.31 A 361.293 361.293 0 0 1 26.1 84.3 L 26.1 85.9 A 65.801 65.801 0 0 1 29.049 86.203 C 32.25 86.611 34.372 87.175 35.7 87.8 A 4.067 4.067 0 0 1 36.885 88.683 A 5.848 5.848 0 0 1 38.1 91 A 27.321 27.321 0 0 0 41.031 90.572 C 46.306 89.475 47.207 87.052 47.293 83.796 A 22.784 22.784 0 0 0 47.3 83.2 L 47.3 56.6 L 87.9 56.6 A 4.381 4.381 0 0 0 88.855 56.505 C 89.705 56.314 90.265 55.834 90.494 55.022 A 2.621 2.621 0 0 0 90.5 55 C 87.699 52.47 83.428 49.042 82.631 48.404 A 87.178 87.178 0 0 0 82.5 48.3 L 78.1 53.6 Z M 74.3 26.6 L 75.7 27.3 C 79.2 25 84.2 20.9 86.8 17.9 A 40.537 40.537 0 0 0 88.024 17.822 C 88.921 17.747 89.616 17.627 90.165 17.355 A 2.47 2.47 0 0 0 90.7 17 L 84.1 10.6 L 80.5 14.2 L 47.3 14.2 L 47.3 3.6 A 7.923 7.923 0 0 0 48.583 3.34 C 49.672 3.014 50.359 2.478 50.72 1.788 A 2.737 2.737 0 0 0 51 0.9 L 42.9 0 L 42.9 14.2 L 12.8 14.2 C 12.7 12.5 12.5 10.6 12 8.6 L 10.1 8.6 A 22.009 22.009 0 0 1 10.118 9.504 C 10.118 16.487 6.843 23.212 3.2 25.8 A 7.093 7.093 0 0 0 1.977 27.057 C 1.184 28.127 0.895 29.313 1.6 30.3 A 2.264 2.264 0 0 0 3.407 31.227 C 4.782 31.303 6.502 30.533 7.8 29.3 A 9.59 9.59 0 0 0 8.114 29.014 C 10.034 27.189 11.955 23.912 12.602 19.298 A 23.565 23.565 0 0 0 12.8 17.2 L 80.1 17.2 C 78.506 20.2 76.297 23.727 74.627 26.134 A 59.949 59.949 0 0 1 74.3 26.6 Z"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}
