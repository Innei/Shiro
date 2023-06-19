/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

import { useIsLogged } from '~/atoms/owner'
import { useNoteData } from '~/hooks/data/use-note'
import { toast } from '~/lib/toast'

export const NoteHideIfSecret: Component = ({ children }) => {
  const note = useNoteData()
  const secretDate = useMemo(() => new Date(note?.secret!), [note?.secret])
  const isSecret = note?.secret
    ? dayjs(note?.secret).isAfter(new Date())
    : false

  const isLogged = useIsLogged()

  useEffect(() => {
    if (!note?.id) return
    let timer: any
    const timeout = +secretDate - +new Date()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        toast('刷新以查看解锁的文章', 'info', { autoClose: false })
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate, note?.id])

  if (!note) return null

  if (isSecret) {
    const dateFormat = note.secret
      ? Intl.DateTimeFormat('zh-cn', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }).format(new Date(note.secret))
      : ''

    if (isLogged) {
      return (
        <>
          <div className="my-6 text-center">
            <p>这是一篇非公开的文章。(将在 {dateFormat} 解锁)</p>
            <p>现在处于登录状态，预览模式：</p>
          </div>
          {children}
        </>
      )
    }
    return (
      <div className="my-6 text-center">
        这篇文章暂时没有公开呢，将会在 {dateFormat} 解锁，再等等哦
      </div>
    )
  }
  return children
}
