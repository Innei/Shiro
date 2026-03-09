import type { Locale } from '~/i18n/config'
import { redirect } from '~/i18n/navigation'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage<{
  category: string
  locale: Locale
}>()({
  fetcher({ category }) {
    return apiClient.post.getFullUrl(category)
  },
  async Component({ data, params }) {
    const { locale } = params
    redirect({ href: `/posts${data.path}`, locale })

    return (
      <div>
        正在重定向到 <pre>{`/posts${data.path}`}</pre>
      </div>
    )
  },
})
