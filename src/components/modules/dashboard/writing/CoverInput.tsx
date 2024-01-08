import clsx from 'clsx'
import type { FC } from 'react'

import { CloseIcon } from '~/components/icons/close'
import { Input } from '~/components/ui/input'
import { toast } from '~/lib/toast'

import { SidebarSection } from './SidebarBase'

const isUrl = (url: string) => {
  try {
    return new URL(url).protocol.startsWith('http')
  } catch (e) {
    return false
  }
}
export const CoverInput: FC<{
  accessor: [any, (value: any) => void]
}> = ({ accessor }) => {
  const [meta, setMeta] = accessor

  const value = meta?.cover || ''
  const reset = () => {
    const nextValue = {
      ...meta,
    }
    delete nextValue.cover
    setMeta(nextValue)
  }
  return (
    <SidebarSection label="Cover">
      <div className="relative">
        <Input
          className={clsx('w-full', !!value && 'pr-8')}
          value={value}
          onChange={(e) => {
            const value = e.target.value

            if (value === '') {
              reset()
              return
            }
            if (!isUrl(value)) {
              toast.error('只能粘贴一个图片链接')
              return
            }
            setMeta({
              ...meta,
              cover: value,
            })
          }}
        />
        {!!value && (
          <button className="cursor-default" onClick={reset}>
            <CloseIcon className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 duration-200 hover:opacity-90 dark:bg-zinc-800" />
          </button>
        )}
      </div>
    </SidebarSection>
  )
}
