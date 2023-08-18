import { clsxm } from '~/lib/helper'

const headers = {
  referer: `https://link.bilibili.com/p/center/index?visit_id=22ast2mb9zhc`,
  'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Shiro`,
}

const fetchData = async (cid: string, lang = 'zh') => {
  if (!cid) {
    return null
  }
  const abortController = new AbortController()

  setTimeout(() => {
    abortController.abort()
  }, 3000)

  return fetch(`https://xlog.app/api/summary?cid=${cid}&lang=${lang}`, {
    headers: new Headers(headers),
    signal: abortController.signal,
    next: {
      revalidate: 60 * 10,
    },
  })
    .then((res) => res.json())
    .catch(() => null)
}

export const XLogSummary = async (
  props: ComponentType<{
    cid: string
  }>,
) => {
  const { cid } = props
  if (!cid) return null

  const data = await fetchData(cid)
  if (!data) return null
  return (
    <div
      data-hide-print
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        props.className,
      )}
    >
      <div className="flex items-center">
        <i className="icon-[mingcute--sparkles-line] mr-2 text-lg" />
        AI 生成的摘要
      </div>

      <p className="text-base-content/85 !m-0 text-sm leading-loose">
        {data?.data}
      </p>
      <p className="border-slate-200 text-right text-sm dark:border-slate-800 ">
        (此服务由{' '}
        <a href="https://xlog.app" target="_blank" rel="noreferrer">
          xLog
        </a>{' '}
        驱动)
      </p>
    </div>
  )
}
