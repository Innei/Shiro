import { locales } from '~/i18n/config'
import { escapeXml } from '~/lib/helper.server'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'
import {
  buildLocalePrefixedPath,
  HREFLANG_BY_LOCALE,
  stripLocaleFromPathname,
} from '~/lib/seo/hreflang'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 hour
export const GET = async () => {
  const queryClient = getQueryClient()

  const { data } = await queryClient.fetchQuery({
    queryKey: ['sitemap'],
    queryFn: async () => {
      const path = apiClient.aggregate.proxy.sitemap.toString(true)
      return fetch(path).then((res) => res.json())
    },
  })

  const buildAlternateLinksForPostOrNote = (rawUrl: string) => {
    let url: URL
    try {
      url = new URL(rawUrl)
    } catch {
      return ''
    }

    const basePath = stripLocaleFromPathname(url.pathname)
    const parts = basePath.split('/').filter(Boolean)
    const isPost = parts[0] === 'posts' && parts.length >= 3
    const isNote = parts[0] === 'notes' && parts.length >= 2
    if (!isPost && !isNote) return ''

    const { origin } = url

    const links = locales
      .map((loc) => {
        const hrefLang = HREFLANG_BY_LOCALE[loc]
        const href = `${origin}${buildLocalePrefixedPath(loc, basePath)}`
        return `  <xhtml:link rel="alternate" hreflang="${escapeXml(
          hrefLang,
        )}" href="${escapeXml(href)}" />`
      })
      .join('\n')

    const xDefaultHref = `${origin}${basePath}`
    const xDefault = `  <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
      xDefaultHref,
    )}" />`

    return `${links}\n${xDefault}`
  }

  const xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${data
    .map((item: any) => {
      const loc = escapeXml(String(item.url ?? ''))
      const lastmod = item.published_at
        ? escapeXml(String(item.published_at))
        : ''
      const alternates = item.url
        ? buildAlternateLinksForPostOrNote(String(item.url))
        : ''

      return `<url>
  <loc>${loc}</loc>
${lastmod ? `  <lastmod>${lastmod}</lastmod>` : ''}
  <changefreq>daily</changefreq>
${alternates ? `${alternates}\n` : ''}</url>`
    })
    .join('')}
  </urlset>
  `.trim()
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
