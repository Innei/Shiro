import 'server-only'

import chroma from 'chroma-js'
import Color from 'colorjs.io'


/**
 * 将十六进制颜色转换为OKLCH字符串
 */
export const hexToOklchString = (hex: string) => new Color(hex).oklch

/**
 * 默认背景色
 */
export const DEFAULT_BACKGROUNDS = {
  light: 'rgb(250, 250, 250)',
  dark: 'rgb(0, 2, 18)',
} as const

/**
 * 颜色样式生成配置
 */
export interface AccentColorStyleConfig {
  /** 主题颜色映射 */
  colors: {
    light: string
    dark: string
  }
  /** 是否使用themed类选择器 */
  useThemedClass?: boolean
  /** 自定义根背景混合比例 */
  mixRatio?: {
    light: number
    dark: number
  }
}

/**
 * 生成主题色相关的CSS样式
 */
export async function generateAccentColorStyle(
  config: AccentColorStyleConfig,
): Promise<string> {
  const {
    colors,
    useThemedClass = false,
    mixRatio = { light: 0.05, dark: 0.12 },
  } = config

  const lightOklch = hexToOklchString(colors.light)
  const darkOklch = hexToOklchString(colors.dark)

  const [hl, sl, ll] = lightOklch
  const [hd, sd, ld] = darkOklch

  let cssContent = ''

  // 生成主题色变量 (DaisyUI v5 使用 --color-accent，值为完整 oklch)
  const themeSelector = useThemedClass ? 'html.themed' : 'html'
  cssContent += `
        ${themeSelector}[data-theme='light'] {
          --color-accent: oklch(${hl} ${sl} ${ll});
        }
        ${themeSelector}[data-theme='dark'] {
          --color-accent: oklch(${hd} ${sd} ${ld});
        }`

  // 生成根背景色 (DaisyUI 用 :where() 特异性为 0，我们用更高特异性覆盖)
  const lightRootBg = chroma
    .mix(DEFAULT_BACKGROUNDS.light, colors.light, mixRatio.light, 'rgb')
    .hex()
  const darkRootBg = chroma
    .mix(DEFAULT_BACKGROUNDS.dark, colors.dark, mixRatio.dark, 'rgb')
    .hex()

  if (useThemedClass) {
    cssContent += `
        html.themed[data-theme='light'] {
          --footer-bg: ${lightRootBg};
        }
        html.themed[data-theme='dark'] {
          --footer-bg: ${darkRootBg};
        }`
  } else {
    cssContent += `
        :root[data-theme='light'] {
          --footer-bg: ${lightRootBg};
        }
        :root[data-theme='dark'] {
          --footer-bg: ${darkRootBg};
        }`
  }

  return cssContent
}

/**
 * 单色主题样式生成（用于页面级别的颜色覆盖）
 */
export async function generateSingleColorStyle(
  color: string,
  options: {
    useThemedClass?: boolean
    mixRatio?: { light: number; dark: number }
  } = {},
): Promise<string> {
  return generateAccentColorStyle({
    colors: {
      light: color,
      dark: color,
    },
    ...options,
  })
}
