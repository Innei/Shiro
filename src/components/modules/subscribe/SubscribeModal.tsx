'use client'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'
import type * as React from 'react'
import type { FC } from 'react'
import { useEffect, useReducer } from 'react'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'
import { useStateToRef } from '~/hooks/common/use-state-ref'
import { preventDefault } from '~/lib/dom'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { useIsEnableSubscribe, useSubscribeStatusQuery } from './hooks'

interface SubscribeModalProps {
  onConfirm: () => void
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[]
}

const subscribeTextMap: Record<string, string> = {
  post_c: '文章',
  note_c: '手记',
  say_c: '说说',
  recently_c: '速记',
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

  const query = useSubscribeStatusQuery()

  const handleSubList: React.EventHandler<any> = async (e) => {
    if (!canSub) {
      toast.error('订阅功能暂时没有开启哦')
      return
    }
    preventDefault(e)
    const { email, types } = state
    await apiClient.subscribe.subscribe(
      email,
      // @ts-ignore
      Object.keys(types).filter((name) => state.types[name]) as any[],
    )

    toast.success('订阅成功，谢谢你！')
    dispatch({ type: 'reset' })
    onConfirm()
  }
  const title = useAggregationSelector((data) => data.seo.title)

  return (
    <form onSubmit={handleSubList} className="flex flex-col gap-5">
      <p className="text-sm opacity-90">
        欢迎订阅「{title}
        」，我会定期推送最新的内容到你的邮箱。
      </p>
      <Input
        type="text"
        placeholder="留下你的邮箱哦 *"
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
              <input
                className="checkbox-accent checkbox checkbox-sm mr-2"
                type="checkbox"
                onChange={(e) => {
                  dispatch({
                    type: 'set',
                    data: {
                      types: {
                        ...state.types,
                        [name]: e.target.checked,
                      },
                    },
                  })
                }}
                // @ts-ignore
                checked={state.types[name]}
                id={name}
              />
              <label htmlFor={name} className="text-shizuku">
                {subscribeTextMap[name]}
              </label>
            </fieldset>
          ))}
      </div>

      <p className="-mt-2 text-sm opacity-90">
        或者你也可以通过{' '}
        <a href="/feed" className="text-green" target="_blank" rel="noreferrer">
          /feed
        </a>{' '}
        订阅「{title}」的 RSS 流。
      </p>
      <StyledButton disabled={!state.email}>订阅</StyledButton>
    </form>
  )
}
