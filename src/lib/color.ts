const getRandomColor = (
  lightness: [number, number],
  saturation: [number, number],
  hue: number,
) => {
  const satAccent = Math.floor(
    Math.random() * (saturation[1] - saturation[0] + 1) + saturation[0],
  )
  const lightAccent = Math.floor(
    Math.random() * (lightness[1] - lightness[0] + 1) + lightness[0],
  )

  // Generate the background color by increasing the lightness and decreasing the saturation
  const satBackground = satAccent > 30 ? satAccent - 30 : 0
  const lightBackground = lightAccent < 80 ? lightAccent + 20 : 100

  return {
    accent: `hsl(${hue}, ${satAccent}%, ${lightAccent}%)`,
    background: `hsl(${hue}, ${satBackground}%, ${lightBackground}%)`,
  }
}

export function stringToHue(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return hue < 0 ? hue + 360 : hue
}

export const getColorScheme = (hue?: number) => {
  const baseHue = hue ?? Math.floor(Math.random() * 361)
  const complementaryHue = (baseHue + 180) % 360

  // For light theme, we limit the lightness between 40 and 70 to avoid too bright colors for accent
  const lightColors = getRandomColor([40, 70], [70, 90], baseHue)

  // For dark theme, we limit the lightness between 20 and 50 to avoid too dark colors for accent
  const darkColors = getRandomColor([20, 50], [70, 90], complementaryHue)

  return {
    light: {
      accent: lightColors.accent,
      background: lightColors.background,
    },
    dark: {
      accent: darkColors.accent,
      background: darkColors.background,
    },
  }
}
export function addAlphaToHex(hex: string, alpha: number): string {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    throw new Error('Invalid hex color value')
  }

  let color = ''
  if (hex.length === 4) {
    color = `#${[1, 2, 3]
      .map(
        (index) =>
          parseInt(hex.charAt(index), 16).toString(16) +
          parseInt(hex.charAt(index), 16).toString(16),
      )
      .join('')}`
  } else {
    color = hex
  }

  const r = parseInt(color.substr(1, 2), 16)
  const g = parseInt(color.substr(3, 2), 16)
  const b = parseInt(color.substr(5, 2), 16)

  return `rgba(${r},${g},${b},${alpha})`
}

export function addAlphaToHSL(hsl: string, alpha: number): string {
  if (!/^hsl\((\d{1,3}),\s*([\d.]+)%,\s*([\d.]+)%\)$/.test(hsl)) {
    throw new Error('Invalid HSL color value')
  }

  const hsla = `${hsl.slice(0, -1)}, ${alpha})`
  return hsla.replace('hsl', 'hsla')
}
