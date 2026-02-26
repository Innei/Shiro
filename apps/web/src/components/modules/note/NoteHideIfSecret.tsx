'use client'

import dayjs from 'dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { toast } from '~/lib/toast'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

export const NoteHideIfSecret: Component = ({ children }) => {
  const t = useTranslations('note')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const noteSecret = useCurrentNoteDataSelector((data) => data?.data.publicAt)

  const noteId = useCurrentNoteDataSelector((data) => data?.data.nid)
  const secretDate = useMemo(() => new Date(noteSecret!), [noteSecret])
  const isSecret = noteSecret ? dayjs(noteSecret).isAfter(new Date()) : false

  const isLogged = useIsOwnerLogged()

  useEffect(() => {
    if (!noteId) return
    let timer: any
    const timeout = +secretDate - Date.now()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        toast.info(tCommon('refresh_to_view'), { autoClose: false })
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate, noteId])

  if (!noteId) return null

  if (isSecret) {
    const localeMap: Record<string, string> = {
      zh: 'zh-cn',
      en: 'en-US',
      ja: 'ja-JP',
    }
    const dateFormat = noteSecret
      ? Intl.DateTimeFormat(localeMap[locale] || locale, {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }).format(new Date(noteSecret))
      : ''

    if (isLogged) {
      return (
        <>
          <div className="my-6 text-center">
            <p>
              {t('secret_prefix')}
              {dateFormat}
              {t('secret_suffix')}
            </p>
            <p>{t('preview_mode')}</p>
          </div>
          {children}
        </>
      )
    }
    return (
      <div className="my-6 text-center">
        {t('secret_prefix')}
        {dateFormat}
        {t('secret_suffix')}
      </div>
    )
  }
  return children
}
