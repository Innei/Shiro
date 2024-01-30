import type { FC, PropsWithChildren } from 'react'

export const BlockLoading: FC<PropsWithChildren> = (props) => {
  return (
    <div className="flex h-[500px] items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-neutral-800">
      {props.children}
    </div>
  )
}
