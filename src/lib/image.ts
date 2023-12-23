export const calculateDimensions = ({
  width,
  height,
  max,
}: {
  width: number
  height: number
  max: { width: number; height: number }
}) => {
  if (width === 0 || height === 0) throw new Error('Invalid image size')

  const { width: maxW, height: maxH } = max

  const wRatio = maxW / width || 1
  const hRatio = maxH / height || 1

  const ratio = Math.min(wRatio, hRatio, 1)

  return {
    width: width * ratio,
    height: height * ratio,
  }
}

export function getDominantColor(imageObject: HTMLImageElement) {
  const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d')!

  canvas.width = 1
  canvas.height = 1

  // draw the image to one pixel and let the browser find the dominant color
  ctx.drawImage(imageObject, 0, 0, 1, 1)

  // get pixel color
  const i = ctx.getImageData(0, 0, 1, 1).data

  return `#${((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2])
    .toString(16)
    .slice(1)}`
}
