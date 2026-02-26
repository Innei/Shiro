'use client'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'
import { useTranslations } from 'next-intl'
import type * as React from 'react'
import type { FC } from 'react'
import { useEffect, useReducer } from 'react'

import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { StyledButton } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input/Input'
import { useStateToRef } from '~/hooks/common/use-state-ref'
import { preventDefault } from '~/lib/dom'
import { registerPushWorker } from '~/lib/push-worker'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { useIsEnableSubscribe, useSubscribeStatusQuery } from './hooks'

interface SubscribeModalProps {
  onConfirm: () => void
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[]
}

const subscribeTextKeys: Record<string, string> = {
  post_c: 'type_post',
  note_c: 'type_note',
  say_c: 'type_say',
  recently_c: 'type_recently',
}

const initialState = {
  email: '',
  types: {
    post_c: false,
    note_c: false,
    say_c: false,
    recently_c: false,
  },
}

type Action =
  | { type: 'set'; data: Partial<typeof initialState> }
  | { type: 'reset' }

const useFormData = () => {
  const [state, dispatch] = useReducer(
    (state: typeof initialState, payload: Action) => {
      switch (payload.type) {
        case 'set': {
          return { ...state, ...payload.data }
        }
        case 'reset': {
          return initialState
        }
      }
    },
    { ...initialState },
  )
  return [state, dispatch] as const
}

export const SubscribeModal: FC<SubscribeModalProps> = ({
  onConfirm,
  defaultTypes,
}) => {
  const t = useTranslations('subscribe')
  const [state, dispatch] = useFormData()

  const canSub = useIsEnableSubscribe()

  const stateRef = useStateToRef(state)

  useEffect(() => {
    if (!defaultTypes || defaultTypes.length === 0) {
      return
    }

    dispatch({
      type: 'set',
      data: {
        types: defaultTypes.reduce(
          (acc, type) => {
            // @ts-ignore
            acc[type] = true
            return acc
          },
          { ...stateRef.current.types },
        ),
      },
    })
  }, [])

  useEffect(() => {
    registerPushWorker()
  }, [])

  const query = useSubscribeStatusQuery()

  const handleSubList: React.EventHandler<any> = async (e) => {
    if (!canSub) {
      toast.error(t('not_enabled'))
      return
    }
    preventDefault(e)
    const { email, types } = state
    await apiClient.subscribe.subscribe(
      email,
      // @ts-ignore
      Object.keys(types).filter((name) => state.types[name]) as any[],
    )

    toast.success(t('success'))
    dispatch({ type: 'reset' })
    onConfirm()
  }
  const title = useAggregationSelector((data) => data.seo.title)
  const tg = useAppConfigSelector((data) => data.module.subscription.tg)

  return (
    <form onSubmit={handleSubList} className="flex flex-col gap-5">
      <p className="text-sm">{t('welcome', { title: title || '' })}</p>
      <Input
        type="text"
        placeholder={t('form_email')}
        required
        value={state.email}
        onChange={(e) => {
          dispatch({ type: 'set', data: { email: e.target.value } })
        }}
      />
      <div className="mb-2 flex gap-10">
        {Object.keys(state.types)
          .filter((type) => query.data?.allowTypes.includes(type as any))
          .map((name) => (
            <fieldset
              className="children:cursor-pointer inline-flex items-center text-sm"
              key={name}
            >
              <Checkbox
                id={name}
                checked={state.types[name as keyof typeof state.types]}
                onCheckedChange={(v) => {
                  if (typeof v === 'boolean') {
                    dispatch({
                      type: 'set',
                      data: {
                        types: {
                          ...state.types,
                          [name]: v,
                        },
                      },
                    })
                  }
                }}
              />
              <label htmlFor={name}>{t(subscribeTextKeys[name])}</label>
            </fieldset>
          ))}
      </div>

      <p className="-mt-2 text-sm">
        {t('rss_hint')}{' '}
        <a
          href="/feed"
          className="text-accent underline"
          target="_blank"
          rel="noreferrer"
        >
          /feed
        </a>{' '}
        {t('rss_suffix', { title: title || '' })}
      </p>
      {tg && (
        <p className="flex items-center gap-2 text-sm">
          {t('telegram_hint')}{' '}
          <a
            href={`https://t.me/${tg.replace('@', '')}`}
            className="center flex gap-1 text-accent underline"
            target="_blank"
          >
            <IcBaselineTelegram className="text-lg text-[#2AABEE]" />
            <span>{tg}</span>
          </a>
        </p>
      )}
      <div className="flex justify-end">
        <StyledButton disabled={!state.email}>{t('submit')}</StyledButton>
      </div>
    </form>
  )
}
