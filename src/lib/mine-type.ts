const videoExts = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'flv', 'wmv', 'mkv']

export const isVideoExt = (ext: string) => {
  return videoExts.includes(ext)
}
