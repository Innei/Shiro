import Link from 'next/link'

import { MotionButtonBase } from '~/components/ui/button'
import { apiClient } from '~/lib/request'

import { ThinkingItem } from '../item'

export default async function Page({
  params,
}: {
  params: {
    id: string
  }
}) {
  const data = await apiClient.recently.getById(params.id)

  return (
    <div>
      <header className="prose">
        <h1 className="flex items-end gap-2">
          思考
          <a
            data-event="Say RSS click"
            aria-hidden
            href="/thinking/feed"
            target="_blank"
            className="flex size-8 select-none text-[#EE802F] center" rel="noreferrer"
          >
            <i className="icon-[mingcute--rss-fill]" />
          </a>
        </h1>
        <h3>谢谢你听我诉说</h3>
      </header>

      <main className="-mt-12">
        <MotionButtonBase>
          <Link
            href="/thinking"
            className="flex items-center gap-2"
            data-event="Say back click"
          >
            <i className="icon-[mingcute--arrow-left-circle-line]" />
            返回
          </Link>
        </MotionButtonBase>
        <ThinkingItem item={data.$serialized} />
      </main>
    </div>
  )
}
