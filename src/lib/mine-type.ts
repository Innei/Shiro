const videoExts = new Set([
  'mp4',
  'webm',
  'ogg',
  'avi',
  'mov',
  'flv',
  'wmv',
  'mkv',
])

export const isVideoExt = (ext: string) => {
  return videoExts.has(ext)
}
