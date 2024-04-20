import { useQuery } from '@tanstack/react-query'

import { FloatPopover } from '~/components/ui/float-popover'

export const ShiJu = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['shiju'],
    queryFn: () => getJinRiShiCiOne(),
    staleTime: Infinity,

    select(data) {
      return {
        shiju: data.content,
        shijuData: data,
      }
    },
  })
  if (isLoading) return <div className="loading loading-dots" />
  const origin = data?.shijuData.origin

  if (!origin) return null
  return (
    <FloatPopover mobileAsSheet triggerElement={<span>{data?.shiju}</span>}>
      <div className="max-w-[800px] text-center">
        <h3 className="sticky top-0 py-2 text-2xl font-medium">
          {origin.title}
        </h3>
        <h4 className="my-4">
          【{origin.dynasty.replace(/代$/, '')}】{origin.author}
        </h4>
        <div className="px-6">
          {origin.content.map((c) => (
            <p key={c} className="flex">
              {c}
            </p>
          ))}
        </div>
      </div>
    </FloatPopover>
  )
}

interface ShiJuData {
  id: number
  content: string
  origin: {
    title: string
    dynasty: string
    author: string
    content: string[]
    matchTags: string[]
  }
}
export const getJinRiShiCiOne = async () => {
  const res = await fetch('https://v2.jinrishici.com/one.json')
  const json = await res.json()
  return json.data as ShiJuData
}
