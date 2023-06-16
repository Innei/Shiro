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
    const match = regexp.exec(line)
    if (!match) {
      continue
    }

    const [, name, url, footnote] = match
    res.push({ name, url, footnote })
  }

  return res
}
