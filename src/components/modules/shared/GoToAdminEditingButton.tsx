'use client'

import { useIsLogged, useResolveAdminUrl } from '~/atoms/hooks'
import { clsxm } from '~/lib/helper'

interface Props {
  type: 'notes' | 'pages' | 'posts'
  id: string
}
export const GoToAdminEditingButton: Component<Props> = (props) => {
  const isLogin = useIsLogged()
  console.log(isLogin)
  const resolveAdminUrl = useResolveAdminUrl()
  const { id, type, className } = props
  if (!isLogin) return null

  const adminUrl = resolveAdminUrl(`#/${type}/edit?id=${id}`)
  if (!adminUrl) return null
  return (
    <a
      href={adminUrl}
      data-hide-print
      target="_blank"
      className={clsxm(
        'flex size-8 rounded-full text-accent no-underline opacity-80 ring-1 ring-slate-200 duration-200 center hover:opacity-100 dark:ring-neutral-800',
        className,
      )}
      rel="noreferrer"
    >
      <i className="icon-[mingcute--quill-pen-line]" />
      <span className="sr-only">编辑</span>
    </a>
  )
}
