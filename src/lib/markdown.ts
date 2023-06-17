import RemoveMarkdown from 'remove-markdown'

export function getSummaryFromMd(text: string): string
export function getSummaryFromMd(
  text: string,
  options: { count: true; length?: number },
): { description: string; wordCount: number }

export function getSummaryFromMd(
  text: string,
  options: { count?: boolean; length?: number } = {
    count: false,
    length: 150,
  },
) {
  const rawText = RemoveMarkdown(text, { gfm: true })
  const description = rawText.slice(0, options.length).replace(/[\s]/gm, ' ')
  if (options.count) {
    return {
      description,
      wordCount: rawText.length,
    }
  }
  return description
}
