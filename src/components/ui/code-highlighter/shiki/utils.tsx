export const parseFilenameFromAttrs = (attrs: string) => {
  // filename=""

  const match = attrs.match(/filename="([^"]+)"/)
  if (match) {
    return match[1]
  }
  return null
}

export const isSupportedShikiLang = (lang: string) => {
  return [
    'javascript',
    'typescript',
    'ts',
    'js',
    'css',
    'tsx',
    'jsx',
    'json',
    'sql',
    'markdown',
    'vue',
    'rust',
    'go',
    'cpp',
    'c',
    'html',
    'asm',
    'bash',
    'ps',
    'ps1',
    // plain text
    'text',
    'plaintext',
    'txt',
    'plain',
  ].includes(lang.toLowerCase())
}
