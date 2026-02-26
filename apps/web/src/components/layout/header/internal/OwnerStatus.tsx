import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { setOwnerStatus, useOwnerStatus } from '~/atoms/hooks/status'
import type { OwnerStatus as TOwnerStatus } from '~/atoms/status'
import { StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import type { FormContextType, InputFieldProps } from '~/components/ui/form'
import { Form, FormInput } from '~/components/ui/form'
import { useCurrentModal, useModalStack } from '~/components/ui/modal'
import { Select } from '~/components/ui/select'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { stopPropagation } from '~/lib/dom'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

const EmojiPicker = dynamic(() =>
  import('~/components/modules/shared/EmojiPicker').then(
    (mod) => mod.EmojiPicker,
  ),
)

export const OwnerStatus = () => {
  const t = useTranslations('common')
  const pageIsActive = usePageIsActive()
  const { data: statusFromRequest, isLoading: statusLoading } = useQuery({
    queryKey: ['shiro-status'],
    queryFn: () => apiClient.proxy.fn.shiro.status.get<TOwnerStatus | null>(),
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    enabled: pageIsActive,
    meta: {
      persist: false,
    },
  })

  useEffect(() => {
    if (statusLoading) return
    if (!statusFromRequest) {
      setOwnerStatus(null)
    } else setOwnerStatus({ ...statusFromRequest })
  }, [statusFromRequest, statusLoading])

  const ownerStatus = useOwnerStatus()
  const isLogged = useIsOwnerLogged()

  const [mouseEnter, setMouseEnter] = useState(false)
  const { present } = useModalStack()
  const triggerElement = (
    <div
      role={isLogged ? 'button' : 'img'}
      tabIndex={isLogged ? 0 : -1}
      onMouseEnter={() => {
        setMouseEnter(true)
      }}
      onMouseLeave={() => {
        setMouseEnter(false)
      }}
      onClick={
        isLogged
          ? (e) => {
              e.stopPropagation()
              present({
                title: t('status_set'),
                content: SettingStatusModalContent,
              })
            }
          : stopPropagation
      }
      className={clsx(
        'pointer-events-auto absolute bottom-0 right-0 z-10 flex size-4 cursor-default items-center justify-center rounded-full text-accent duration-200',
        isLogged && mouseEnter && !ownerStatus
          ? 'size-6 rounded-full bg-base-100'
          : '',
        isLogged && mouseEnter && 'cursor-pointer',
      )}
    >
      {isLogged && mouseEnter ? (
        <i className="i-mingcute-emoji-line" />
      ) : (
        ownerStatus?.emoji
      )}
    </div>
  )

  if (!isLogged && !ownerStatus) return null
  return (
    <FloatPopover
      placement="bottom"
      asChild
      mobileAsSheet
      triggerElement={triggerElement}
      type="tooltip"
    >
      <div className="flex flex-col gap-1 text-lg">
        {ownerStatus && (
          <>
            <p className="font-bold">
              {t('status_current')}
              {ownerStatus?.emoji} {ownerStatus?.desc}
            </p>
            {!!ownerStatus.untilAt && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('status_until')} {formatDatetime(ownerStatus.untilAt)}
              </p>
            )}
          </>
        )}

        {!ownerStatus && isLogged && <p>{t('status_click_to_set')}</p>}
      </div>
    </FloatPopover>
  )
}
const formatDatetime = (ts: number) => {
  const date = new Date(ts)
  // 如果在明天
  if (new Date().getDate() !== date.getDate()) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return date.toLocaleTimeString()
}

const SettingStatusModalContent = () => {
  const t = useTranslations('common')
  const ownerStatus = useOwnerStatus()
  const inputs = [
    {
      name: 'emoji',
      placeholder: 'Emoji *',
      defaultValue: ownerStatus?.emoji,
      rules: [
        {
          validator: (value: string) => !!value,
          message: t('status_emoji_required'),
        },
      ],
    },
    {
      name: 'desc',
      placeholder: t('status_desc_placeholder'),
      defaultValue: ownerStatus?.desc,
      rules: [
        {
          validator: (value: string) => !!value,
          message: t('status_desc_required'),
        },
      ],
    },
    {
      name: 'ttl',
      placeholder: t('status_duration_placeholder'),
      type: 'number',
      defaultValue: 1,
      rules: [
        {
          validator: (value: string) => !Number.isNaN(Number(value)),
          message: t('status_duration_number'),
        },
      ],
      transform(value) {
        return +value
      },
    },
  ] as InputFieldProps[]
  const formRef = useRef<FormContextType>(null)
  const { dismiss } = useCurrentModal()
  const [isLoading, setIsLoading] = useState(false)
  const [timeType, setTimeType] = useState<'m' | 's' | 'h' | 'd'>('m')

  const handleSubmit = useCallback(async () => {
    if (!formRef.current) return
    const currentValues = formRef.current.getCurrentValues()
    setIsLoading(true)

    await apiClient.serverless.proxy.shiro.status
      .post({
        data: {
          ...currentValues,
          ttl:
            currentValues.ttl *
            {
              m: 60,
              s: 1,
              h: 60 * 60,
              d: 60 * 60 * 24,
            }[timeType],
        },
      })
      .finally(() => {
        setIsLoading(false)
      })
    toast.success(t('status_set_success'))

    dismiss()
  }, [dismiss, timeType, t])

  const handleReset = useCallback(async () => {
    setIsLoading(true)
    await apiClient.serverless.proxy.shiro.status.delete().finally(() => {
      setIsLoading(false)
    })
    toast.success(t('status_set_success'))

    dismiss()
  }, [dismiss, t])

  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <Form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div ref={wrapperRef} className="relative flex flex-col gap-1">
        <FormInput {...inputs[0]} />
        <FloatPopover
          mobileAsSheet
          trigger="click"
          triggerElement={
            <div
              tabIndex={0}
              role="button"
              className="center absolute right-2 top-3 flex"
            >
              <i className="i-mingcute-emoji-line" />
              <span className="sr-only">{t('emoji_label')}</span>
            </div>
          }
          popoverWrapperClassNames="z-[999]"
          headless
        >
          <EmojiPicker
            onEmojiSelect={(val) => {
              formRef.current?.setValue('emoji', val)
            }}
          />
        </FloatPopover>
      </div>
      {inputs.slice(1, -1).map((input) => (
        <FormInput key={input.name} {...input} />
      ))}

      <div className="mb-4 flex gap-2">
        <FormInput {...(inputs.at(-1) as InputFieldProps)} />
        <Select
          value={timeType}
          onChange={setTimeType}
          values={[
            { label: t('time_minute'), value: 'm' },
            { label: t('time_second'), value: 's' },
            { label: t('time_hour'), value: 'h' },
            { label: t('time_day'), value: 'd' },
          ]}
        />
      </div>

      <div className="center flex w-full gap-2">
        <StyledButton
          className="rounded-md"
          isLoading={isLoading}
          onClick={handleReset}
          variant="secondary"
        >
          {t('actions_reset')}
        </StyledButton>
        <StyledButton isLoading={isLoading} variant="primary" type="submit">
          {t('actions_submit')}
        </StyledButton>
      </div>
    </Form>
  )
}
