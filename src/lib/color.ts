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

export function hexToHsl(hex: string) {
  // Remove the '#' symbol from the hex code
  hex = hex.replace('#', '')

  // Convert hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find the minimum and maximum values among R, G, and B
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)

  // Calculate the hue
  let h = 0
  if (max === min) {
    h = 0 // No hue for achromatic colors
  } else if (max === r) {
    h = ((g - b) / (max - min)) % 6
  } else if (max === g) {
    h = (2 + (b - r) / (max - min)) % 6
  } else {
    h = (4 + (r - g) / (max - min)) % 6
  }
  h = Math.round(h * 60)

  // Calculate the lightness
  const l = (max + min) / 2

  // Calculate the saturation
  let s = 0
  if (max !== min) {
    s = (max - min) / (1 - Math.abs(2 * l - 1))
  }
  s = Math.round(s * 100)

  // Return the HSL values as a string
  return [h, s, Math.round(l * 100)]
}

export function generateTransitionColors(
  startColor: string,
  targetColor: string,
  step: number,
): string[] {
  // Convert startColor and targetColor to RGB values
  const startRed = parseInt(startColor.substring(1, 3), 16)
  const startGreen = parseInt(startColor.substring(3, 5), 16)
  const startBlue = parseInt(startColor.substring(5, 7), 16)

  const targetRed = parseInt(targetColor.substring(1, 3), 16)
  const targetGreen = parseInt(targetColor.substring(3, 5), 16)
  const targetBlue = parseInt(targetColor.substring(5, 7), 16)

  // Calculate increments for each color channel
  const redIncrement = (targetRed - startRed) / step
  const greenIncrement = (targetGreen - startGreen) / step
  const blueIncrement = (targetBlue - startBlue) / step

  const transitionColors: string[] = []

  // Generate transition colors
  for (let i = 0; i < step; i++) {
    // Calculate transition color values
    const transitionRed = Math.round(startRed + redIncrement * i)
    const transitionGreen = Math.round(startGreen + greenIncrement * i)
    const transitionBlue = Math.round(startBlue + blueIncrement * i)

    // Convert RGB values to hex format
    const hexColor = `#${(
      (1 << 24) |
      (transitionRed << 16) |
      (transitionGreen << 8) |
      transitionBlue
    )
      .toString(16)
      .slice(1)}`

    // Add transition color to the result array
    transitionColors.push(hexColor)
  }

  return Array.from(new Set(transitionColors))
}
