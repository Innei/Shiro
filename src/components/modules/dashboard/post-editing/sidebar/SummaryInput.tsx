import { useRef } from 'react'
import OpenAI from 'openai'
import { toast } from 'sonner'
import { useEventCallback } from 'usehooks-ts'
import type { FC } from 'react'

import { OpenAIIcon } from '~/components/icons'
import { Input, Textarea } from '~/components/ui'
import { Button, MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal/stacked/provider'
import { APP_SCOPE } from '~/constants/app'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { useI18n } from '~/i18n/hooks'
import { trpc } from '~/lib/trpc'

import {
  usePostModelGetModelData,
  usePostModelSetModelData,
  usePostModelSingleFieldAtom,
} from '../data-provider'

export const SummaryInput = () => {
  const [summary, setSummary] = usePostModelSingleFieldAtom('summary')
  const getData = usePostModelGetModelData()
  const setter = usePostModelSetModelData()

  const t = useI18n()

  const { present } = useModalStack()

  return (
    <div className="relative">
      <MotionButtonBase
        onClick={() => {
          present({
            title: 'OpenAI Summary',
            content: ({ dismiss }) => (
              <AISummaryModal
                article={getData().text}
                onSuccess={(summary) => {
                  setSummary(summary)
                }}
                dismiss={dismiss}
              />
            ),
          })
        }}
        className="absolute bottom-0 right-2 top-5 z-10 flex items-center"
      >
        <OpenAIIcon />
      </MotionButtonBase>

      <Textarea
        label={t('module.summary.title')}
        placeholder={t('module.summary.placeholder')}
        value={summary}
        onChange={(e) => {
          setter((prev) => {
            return {
              ...prev,
              summary: e.target.value,
            }
          })
        }}
      />
    </div>
  )
}
const AISummaryModal: FC<{
  article: string
  onSuccess: (summary: string) => void

  dismiss: () => void
}> = ({ article, onSuccess, dismiss }) => {
  const placeholder = `Summarize this in Chinese language:
"{text}"
CONCISE SUMMARY:`
  const [, getPrompt, inputRef] =
    useUncontrolledInput<HTMLTextAreaElement>(placeholder)

  const isLoadingRef = useRef(false)
  const TokenStoreKey = 'openai-token'
  const URLStoreKey = 'openai-endpoint'
  const { data: tokenValue, isLoading: isLoading1 } =
    trpc.configs.kv.get.useQuery(
      {
        scope: APP_SCOPE,
        key: TokenStoreKey,
      },
      {
        select(data) {
          if (!data) return ''
          return JSON.parse(data)
        },
      },
    )

  const { data: urlValue, isLoading: isLoading2 } =
    trpc.configs.kv.get.useQuery(
      {
        scope: APP_SCOPE,
        key: URLStoreKey,
      },
      {
        select(data) {
          if (!data) return ''
          return JSON.parse(data)
        },
      },
    )

  const isLoading = isLoading1 || isLoading2

  const handleAskAI = useEventCallback(async () => {
    const ai = new OpenAI({
      apiKey: tokenValue,
      dangerouslyAllowBrowser: true,
      baseURL: urlValue || void 0,
    })

    const finalPrompt = getPrompt()?.replace('{text}', article)
    if (!finalPrompt) return
    const messageIns = toast.loading('AI 正在生成摘要...')
    isLoadingRef.current = true
    const response = await ai.chat.completions
      .create({
        messages: [
          {
            content: finalPrompt,
            role: 'user',
          },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        stream: false,
      })
      .catch((err) => {
        toast.dismiss(messageIns)
        toast.error(`AI 生成摘要失败： ${err.message}`)
      })
      .finally(() => {
        isLoadingRef.current = false
      })

    if (!response) return

    const summary = response.choices[0].message?.content as string
    if (!summary) {
      toast.dismiss(messageIns)
      toast.error('AI 生成摘要失败')
      return
    }

    toast.dismiss(messageIns)
    toast.success(`AI 生成的摘要： ${summary}`)
    onSuccess(summary)
  })

  const trpcUtils = trpc.useUtils()
  const t = useI18n()

  const { mutateAsync: updateKV } = trpc.configs.kv.set.useMutation()
  return (
    <div className="w-[500px] space-y-4">
      <Textarea placeholder={placeholder} label="Prompt" ref={inputRef} />

      <Input
        type="password"
        isLoading={isLoading}
        label="OpenAI Token"
        placeholder="Token is required"
        value={tokenValue || ''}
        onChange={(e) => {
          trpcUtils.configs.kv.get.setData(
            {
              scope: APP_SCOPE,
              key: TokenStoreKey,
            },
            () => JSON.stringify(e.target.value || ''),
          )
        }}
      />
      <Input
        isLoading={isLoading}
        label="OpenAI EndPoint"
        placeholder="https://api.openai.com"
        value={urlValue || ''}
        onChange={(e) => {
          trpcUtils.configs.kv.get.setData(
            {
              scope: APP_SCOPE,
              key: urlValue,
            },
            () => JSON.stringify(e.target.value || ''),
          )
        }}
      />

      <div className="mt-4 flex justify-end space-x-4">
        <Button
          disabled={isLoadingRef.current || !tokenValue}
          color="primary"
          onClick={() => {
            handleAskAI().then(() => {
              updateKV({
                scope: APP_SCOPE,
                key: TokenStoreKey,
                value: tokenValue || '',
              })

              updateKV({
                scope: APP_SCOPE,
                key: URLStoreKey,
                value: urlValue || null,
              })

              dismiss()
            })
          }}
        >
          {t('common.submit')}
        </Button>
      </div>
    </div>
  )
}
