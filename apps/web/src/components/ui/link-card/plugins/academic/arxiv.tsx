import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const arxivPlugin: LinkCardPlugin = {
  name: 'arxiv',
  displayName: 'arXiv Paper',
  priority: 80,
  typeClass: 'academic',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'arxiv.org') return null
    // Match /abs/2301.12345 or /pdf/2301.12345v1
    const match = url.pathname.match(/\/(abs|pdf)\/(\d{4}\.\d+(?:v\d+)?)/i)
    if (!match) return null

    return {
      id: match[2].toLowerCase(),
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    return /^\d{4}\.\d+(?:v\d+)?$/.test(id)
  },

  async fetch(id: string): Promise<LinkCardData> {
    const response = await fetch(
      `https://export.arxiv.org/api/query?id_list=${id}`,
    )
    const text = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'application/xml')

    const entry = xmlDoc.getElementsByTagName('entry')[0]
    const title = entry.getElementsByTagName('title')[0].textContent
    const authors = entry.getElementsByTagName('author')
    const authorNames = Array.from(authors).map(
      (author) => author.getElementsByTagName('name')[0].textContent,
    )

    return {
      title: (
        <span className="flex items-center gap-2">
          <span className="flex-1">{title}</span>
          <span className="shrink-0 place-self-end">
            <span className="inline-flex shrink-0 items-center gap-1 self-center text-sm text-orange-400 dark:text-yellow-500">
              <span className="font-sans font-medium">{id}</span>
            </span>
          </span>
        </span>
      ),
      desc:
        authorNames.length > 1 ? `${authorNames[0]} et al.` : authorNames[0],
    }
  },
}
