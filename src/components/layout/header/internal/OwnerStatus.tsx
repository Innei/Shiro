import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import type { OwnerStatus as TOwnerStatus } from '~/atoms/status'
import type { FormContextType, InputFieldProps } from '~/components/ui/form'

import { useIsLogged } from '~/atoms/hooks'
import { setOwnerStatus, useOwnerStatus } from '~/atoms/hooks/status'
import { StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
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
  const isLogged = useIsLogged()

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
                title: '设置状态',
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
        <i className="icon-[mingcute--emoji-line]" />
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
              现在的状态：{ownerStatus?.emoji} {ownerStatus?.desc}
            </p>
            {!!ownerStatus.untilAt && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                持续到 {formatDatetime(ownerStatus.untilAt)}
              </p>
            )}
          </>
        )}

        {!ownerStatus && isLogged && <p>点击设置状态</p>}
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
  const ownerStatus = useOwnerStatus()
  const [inputs] = useState(
    () =>
      [
        {
          name: 'emoji',
          placeholder: 'Emoji *',
          defaultValue: ownerStatus?.emoji,
          rules: [
            {
              validator: (value: string) => !!value,
              message: 'Emoji 不能为空',
            },
            // {
            //   validator: (value: string) => value.length <= 20,
            //   message: 'Emoji 不能超过 1 个字符',
            // },
          ],
        },
        {
          name: 'desc',
          placeholder: '状态描述 *',
          defaultValue: ownerStatus?.desc,
          rules: [
            {
              validator: (value: string) => !!value,
              message: '状态描述不能为空',
            },
          ],
        },
        {
          name: 'ttl',
          placeholder: '持续时间',
          type: 'number',
          defaultValue: 1,
          rules: [
            {
              validator: (value: string) => !Number.isNaN(Number(value)),
              message: '持续时间必须是数字',
            },
          ],
          transform(value) {
            return +value
          },
        },
      ] as InputFieldProps[],
  )
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
    toast.success('设置成功')

    dismiss()
  }, [dismiss, timeType])

  const handleReset = useCallback(async () => {
    setIsLoading(true)
    await apiClient.serverless.proxy.shiro.status.delete().finally(() => {
      setIsLoading(false)
    })
    toast.success('设置成功')

    dismiss()
  }, [dismiss])

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
              <i className="icon-[mingcute--emoji-line]" />
              <span className="sr-only">表情</span>
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
            { label: '分钟', value: 'm' },
            { label: '秒', value: 's' },
            { label: '小时', value: 'h' },
            { label: '天', value: 'd' },
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
          重置
        </StyledButton>
        <StyledButton isLoading={isLoading} variant="primary" type="submit">
          提交
        </StyledButton>
      </div>
    </Form>
  )
}
