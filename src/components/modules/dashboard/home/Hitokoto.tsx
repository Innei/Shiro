import { useQuery } from '@tanstack/react-query'

import { MotionButtonBase } from '~/components/ui/button'
import { toast } from '~/lib/toast'

export const Hitokoto = () => {
  const {
    data: hitokoto,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: () =>
      fetchHitokoto([
        SentenceType.动画,
        SentenceType.原创,
        SentenceType.哲学,
        SentenceType.文学,
      ]),
    refetchInterval: 1000 * 60 * 60 * 24,
    staleTime: Infinity,
    select(data) {
      const postfix = Object.values({
        from: data.from,
        from_who: data.from_who,
        creator: data.creator,
      }).find(Boolean)
      if (!data.hitokoto) {
        return '没有获取到句子信息'
      } else {
        return data.hitokoto + (postfix ? ` —— ${postfix}` : '')
      }
    },
  })

  if (!hitokoto) return null
  if (isLoading) return <div className="loading loading-dots" />
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="leading-normal">{hitokoto}</span>
      <div className="ml-0 flex items-center space-x-2">
        <MotionButtonBase onClick={() => refetch()}>
          <i className="i-mingcute-refresh-2-line" />
        </MotionButtonBase>

        <MotionButtonBase
          onClick={() => {
            navigator.clipboard.writeText(hitokoto)
            toast.success('已复制')
            toast.info(hitokoto)
          }}
        >
          <i className="i-mingcute-copy-line" />
        </MotionButtonBase>
      </div>
    </div>
  )
}

enum SentenceType {
  '动画' = 'a',
  '漫画' = 'b',
  '游戏' = 'c',
  '文学' = 'd',
  '原创' = 'e',
  '来自网络' = 'f',
  '其他' = 'g',
  '影视' = 'h',
  '诗词' = 'i',
  '网易云' = 'j',
  '哲学' = 'k',
  '抖机灵' = 'l',
}
const fetchHitokoto = async (
  type: SentenceType[] | SentenceType = SentenceType.文学,
) => {
  const json = await fetch(
    `https://v1.hitokoto.cn/${
      Array.isArray(type)
        ? `?${type.map((t) => `c=${t}`).join('&')}`
        : `?c=${type}`
    }`,
  )
  const data = (await (json.json() as unknown)) as {
    id: number
    hitokoto: string
    type: string
    from: string
    from_who: string
    creator: string
    creator_uid: number
    reviewer: number
    uuid: string
    created_at: string
  }

  return data
}
