export interface MImageType {
  name?: string
  url: string
  footnote?: string
}
export const pickImagesFromMarkdown = (md: string) => {
  const regexp =
    /^!\[((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*)\]\(\s*<?((?:[^\s\\]|\\.)*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/

  const lines = md.split('\n')

  const res: MImageType[] = []

  for (const line of lines) {
    if (!line.startsWith('!') && isRawImageUrl(line)) {
      res.push({ url: line, name: line })
      continue
    }

    const match = regexp.exec(line)
    if (!match) {
      continue
    }

    const [, name, url, footnote] = match
    res.push({ name, url, footnote })
  }

  return res
}

const isRawImageUrl = (url: string) => {
  try {
    new URL(url)
  } catch (e) {
    return false
  }
  return true
}
