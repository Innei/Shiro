import chroma from 'chroma-js'
import Color from 'colorjs.io'

import { createPngNoiseBackground } from '~/lib/noise'

const hexToOklchString = (hex: string) => {
  return new Color(hex).oklch
}
const accentColorLight = [
  // 浅葱
  '#33A6B8',

  '#FF6666',
  '#26A69A',
  '#fb7287',
  '#69a6cc',
]
const accentColorDark = [
  // 桃
  '#F596AA',

  '#A0A7D4',
  '#ff7b7b',
  '#99D8CF',
  '#838BC6',
]
const defaultAccentColor = { light: accentColorLight, dark: accentColorDark }

const lightBg = 'rgb(250, 250, 250)'
const darkBg = 'rgb(0, 2, 18)'
export async function AccentColorStyleInjector({
  color,
}: {
  color?: AccentColor
}) {
  const { light, dark } = color || defaultAccentColor

  const lightColors = light ?? accentColorLight
  const darkColors = dark ?? accentColorDark

  const Length = Math.max(lightColors.length ?? 0, darkColors.length ?? 0)
  const randomSeedRef = (Math.random() * Length) | 0
  const currentAccentColorLRef = lightColors[randomSeedRef]
  const currentAccentColorDRef = darkColors[randomSeedRef]

  const lightOklch = hexToOklchString(currentAccentColorLRef)
  const darkOklch = hexToOklchString(currentAccentColorDRef)

  const [hl, sl, ll] = lightOklch
  const [hd, sd, ld] = darkOklch

  const [lightBgImage, darkBgImage] = await Promise.all([
    createPngNoiseBackground(currentAccentColorLRef),
    createPngNoiseBackground(currentAccentColorDRef),
  ])

  return (
    <style
      id="accent-color-style"
      data-light={currentAccentColorLRef}
      data-dark={currentAccentColorDRef}
      dangerouslySetInnerHTML={{
        __html: `
        html[data-theme='light'].noise body::before {
          background-image: ${lightBgImage}
        }
        html[data-theme='dark'].noise body::before {
          background-image: ${darkBgImage}
        }
        html[data-theme='light'] {
          --a: ${`${hl} ${sl} ${ll}`};
        }
        html[data-theme='dark'] {
          --a: ${`${hd} ${sd} ${ld}`};
        }
        html {
          --root-bg: ${chroma.mix(lightBg, currentAccentColorLRef, 0.05, 'rgb').hex()};
          background-color: var(--root-bg) !important;
        }
        html[data-theme='dark'] {
          --root-bg: ${chroma.mix(darkBg, currentAccentColorDRef, 0.12, 'rgb').hex()};
        }
        `,
      }}
    />
  )
}

// const isSafari = () =>
//   /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// const STEP = 60
// const INTERVAL = 500

// export const AccentColorProvider = ({ children }: PropsWithChildren) => {
//   const { light, dark } =
//     useAppConfigSelector((config) => config.color) || (noopObj as AccentColor)

//   const lightColors = light ?? accentColorLight
//   const darkColors = dark ?? accentColorDark

//   const Length = Math.max(lightColors.length ?? 0, darkColors.length ?? 0)
//   const randomSeedRef = useRef((Math.random() * Length) | 0)
//   const currentAccentColorLRef = useRef(lightColors[randomSeedRef.current])
//   const currentAccentColorDRef = useRef(darkColors[randomSeedRef.current])

//   const [u, update] = useState(0)
//   const updateColorEvent = useEventCallback(() => {
//     const $style = document.createElement('style')

//     const nextSeed = (randomSeedRef.current + 1) % Length
//     const nextColorD = darkColors[nextSeed]
//     const nextColorL = lightColors[nextSeed]
//     const colorsD = generateTransitionColors(
//       currentAccentColorDRef.current,
//       nextColorD,
//       STEP,
//     )
//     const colorsL = generateTransitionColors(
//       currentAccentColorLRef.current,
//       nextColorL,
//       STEP,
//     )

//     let timerDispose = setIdleTimeout(function updateAccent() {
//       const colorD = colorsD.shift()
//       const colorL = colorsL.shift()
//       if (colorD && colorL) {
//         currentAccentColorDRef.current = colorD
//         currentAccentColorLRef.current = colorL

//         try {
//           timerDispose()
//         } catch {}
//         timerDispose = setIdleTimeout(updateAccent, INTERVAL)
//       } else {
//         randomSeedRef.current = nextSeed
//         currentAccentColorDRef.current = nextColorD
//         currentAccentColorLRef.current = nextColorL
//         update(u + 1)
//       }

//       const lightHsl = hexToHsl(currentAccentColorLRef.current)
//       const darkHsl = hexToHsl(currentAccentColorDRef.current)

//       const [hl, sl, ll] = lightHsl
//       const [hd, sd, ld] = darkHsl

//       $style.innerHTML = `:root[data-theme='light'] {
//           --a: ${`${hl} ${sl}% ${ll}%`};
//           --af: ${`${hl} ${sl}% ${ll + 6}%`};
//         }
//         :root[data-theme='dark'] {
//           --a: ${`${hd} ${sd}% ${ld}%`};
//           --af: ${`${hd} ${sd}% ${ld - 6}%`};
//         }
//         `
//     }, INTERVAL)

//     document.head.appendChild($style)
//     return () => {
//       timerDispose()

//       setTimeout(() => {
//         document.head.removeChild($style)
//       }, INTERVAL)
//     }
//   })
//   useEffect(() => {

//     // safari 性能不行
//     if (isSafari()) return
//     return updateColorEvent()
//   }, [Length, darkColors, lightColors, u, updateColorEvent])

//   useServerInsertedHTML(() => {
//     const lightHsl = hexToHsl(currentAccentColorLRef.current)
//     const darkHsl = hexToHsl(currentAccentColorDRef.current)

//     const [hl, sl, ll] = lightHsl
//     const [hd, sd, ld] = darkHsl

//     return (
//       <style
//         id="accent-color-style"
//         data-light={currentAccentColorLRef.current}
//         data-dark={currentAccentColorDRef.current}
//         dangerouslySetInnerHTML={{
//           __html: `html[data-theme='light'] {
//           --a: ${`${hl} ${sl}% ${ll}%`};
//           --af: ${`${hl} ${sl}% ${ll + 6}%`};
//         }
//         html[data-theme='dark'] {
//           --a: ${`${hd} ${sd}% ${ld}%`};
//           --af: ${`${hd} ${sd}% ${ld - 6}%`};
//         }
//         `,
//         }}
//       />
//     )
//   })

//   return children
// }

// function setIdleTimeout(onIdle: () => void, timeout: number): () => void {
//   let timeoutId: number | undefined

//   const debounceReset = debounce(() => {
//     clearTimeout(timeoutId)
//     timeoutId = window.setTimeout(() => {
//       onIdle()
//     }, timeout)
//   }, 100)

//   // 重置计时器的函数
//   const resetTimer = () => {
//     window.clearTimeout(timeoutId)
//     debounceReset()
//   }

//   // 监听浏览器的活动事件
//   window.addEventListener('mousemove', resetTimer)
//   window.addEventListener('keypress', resetTimer)
//   window.addEventListener('touchstart', resetTimer)
//   window.addEventListener('scroll', resetTimer)

//   // 启动计时器
//   resetTimer()

//   // 提供取消功能
//   return function cancel(): void {
//     window.clearTimeout(timeoutId)
//     window.removeEventListener('mousemove', resetTimer)
//     window.removeEventListener('keypress', resetTimer)
//     window.removeEventListener('touchstart', resetTimer)
//     window.removeEventListener('scroll', resetTimer)
//   }
// }
