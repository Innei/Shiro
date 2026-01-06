'use server'

import { PNG } from 'pngjs'

const hexToRbg = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
export const createPngNoiseBackground = async (hex: string) => {
  const { b, g, r } = hexToRbg(hex)
  const width = 72
  const height = 72
  const png = new PNG({
    width,
    height,
    filterType: -1, // 禁用过滤器
  })

  // 生成随机噪点
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2
      const rand = Math.random()
      const color = rand > 0.5 ? 255 : 0
      png.data[idx] = r
      png.data[idx + 1] = g
      png.data[idx + 2] = b
      png.data[idx + 3] = color
    }
  }

  return new Promise<string>((resolve) => {
    const chunks = [] as Buffer[]
    png
      .pack()
      .on('data', (chunk) => {
        chunks.push(chunk)
      })
      .on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(`url('data:image/png;base64,${buffer.toString('base64')}')`)
      })
  })
}
