import { encode } from 'blurhash'

import { TENCENT_CDN_DOMAIN } from '~/app.static.config'

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

const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d')!
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
}

export const encodeImageToBlurhash = (image: HTMLImageElement) => {
  const imageData = getImageData(image)
  return encode(imageData.data, imageData.width, imageData.height, 4, 4)
}

export const encodeImageToBlurhashWebgl = (image: HTMLImageElement): string => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') as WebGLRenderingContext | null

  if (!gl) {
    throw new Error('WebGL not supported')
  }

  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  // Create a texture and bind image
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  // Create a framebuffer and attach the texture
  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

  // Read the pixels
  const pixels = new Uint8Array(image.naturalWidth * image.naturalHeight * 4)
  gl.readPixels(
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  )

  // Resize the image to 32x32
  const resizedCanvas = document.createElement('canvas')
  resizedCanvas.width = 32
  resizedCanvas.height = 32
  const resizedCtx = resizedCanvas.getContext('2d')!
  const imageData = new ImageData(
    new Uint8ClampedArray(pixels),
    image.naturalWidth,
    image.naturalHeight,
  )
  resizedCtx.putImageData(imageData, 0, 0)
  resizedCtx.drawImage(resizedCanvas, 0, 0, 32, 32)
  const resizedImageData = resizedCtx.getImageData(0, 0, 32, 32)

  // Encode the resized image to BlurHash
  return encode(resizedImageData.data, 32, 32, 4, 4)
}

export const addImageUrlResizeQuery = (url: string, size: number) => {
  const parsedUrl = new URL(url)

  if (parsedUrl.host === TENCENT_CDN_DOMAIN) {
    // Tencent Cloud 数据万象
    // ?imageMogr2/thumbnail/300x

    return `${url}?imageMogr2/thumbnail/${size}x/strip`
  }

  return url
}
