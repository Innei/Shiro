'use client'

import * as Avatar from '@radix-ui/react-avatar'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'
import {
  forwardRef,
  Fragment,
  memo,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'

import {
  useActivityPresenceByRoomName,
  useActivityPresenceBySessionId,
} from '~/atoms/hooks/activity'
import { useIsLogged, useOwner } from '~/atoms/hooks/owner'
import { useAuthReader, useSessionReader } from '~/atoms/hooks/reader'
import { useSocketSessionId } from '~/atoms/hooks/socket'
import { useIsMobile } from '~/atoms/hooks/viewport'
import { getServerTime } from '~/components/common/SyncServerTime'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import type { FormContextType } from '~/components/ui/form'
import { Form, FormInput } from '~/components/ui/form'
import { useCurrentModal, useModalStack } from '~/components/ui/modal'
import { RootPortal } from '~/components/ui/portal'
import { EmitKeyMap } from '~/constants/keys'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { getUserUrl, signIn } from '~/lib/authjs'
import { getColorScheme, stringToHue } from '~/lib/color'
import { formatSeconds } from '~/lib/datetime'
import { safeJsonParse } from '~/lib/helper'
import { uniq } from '~/lib/lodash'
import { buildNSKey } from '~/lib/ns'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'
import { useAuthProviders } from '~/queries/hooks/authjs'
import { socketWorker } from '~/socket/worker-client'

import { commentStoragePrefix } from '../comment/CommentBox/providers'
import names from './names.json'
import { useRoomContext } from './Room'

export const Presence = () => {
  const isClient = useIsClient()

  return isClient ? <PresenceImpl /> : null
}

const presenceStoredNameAtom = atomWithStorage(buildNSKey('presence-name'), '')

const PresenceImpl = () => {
  const { roomName } = useRoomContext()
  const isMobile = useIsMobile()
  const { refetch } = useQuery({
    ...queries.activity.presence(roomName),

    refetchOnMount: true,
    refetchInterval: 30_000,
  })

  const identity = useSocketSessionId()

  const reader = useSessionReader()
  const owner = useOwner()

  const isOwnerLogged = useIsLogged()
  const commentStoredName = (() => {
    const value = globalThis?.localStorage.getItem(
      `${commentStoragePrefix}author`,
    )
    if (value) {
      return safeJsonParse(value) || value
    }
    return ''
  })()

  const presenceStoredName = useAtomValue(presenceStoredNameAtom)
  const displayName = useMemo(
    () =>
      isOwnerLogged
        ? owner?.name
        : reader?.name || presenceStoredName || commentStoredName || '',
    [
      commentStoredName,
      isOwnerLogged,
      owner?.name,
      presenceStoredName,
      reader?.name,
    ],
  )

  const update = useDebouncedCallback(async (position: number) => {
    const sid = await socketWorker.getSid()
    if (!sid) return
    return apiClient.activity.updatePresence({
      identity,
      position,
      sid,
      roomName,
      displayName: displayName || void 0,
      readerId: reader?.id,
      ts: getServerTime().getTime() || Date.now(),
    })
  }, 1000)

  const percent = useReadPercent()

  const updateWithPercent = useEventCallback(() => update(percent))

  useEffect(() => {
    const handler = () => {
      refetch()
      updateWithPercent()
    }
    globalThis.addEventListener(EmitKeyMap.SocketConnected, handler)

    return () => {
      globalThis.removeEventListener(EmitKeyMap.SocketConnected, handler)
    }
  }, [refetch, updateWithPercent])

  useEffect(() => {
    update(percent)
  }, [percent, update])

  if (isMobile) return null

  return (
    <>
      <ReadPresenceTimeline />

      <DisplayNameHelper displayName={displayName} />
    </>
  )
}

const ReadPresenceTimeline = () => {
  const sessionId = useSocketSessionId()

  const { roomName } = useRoomContext()
  const activityPresenceIdsCurrentRoom = useActivityPresenceByRoomName(roomName)

  const uniqueActivityPresenceIdsCurrentRoom = uniq(
    activityPresenceIdsCurrentRoom,
  )
  // if (uniqueActivityPresenceIdsCurrentRoom.length < 2) return null
  return (
    <RootPortal>
      <div className="group fixed inset-y-20 left-0 z-[3] w-8">
        {uniqueActivityPresenceIdsCurrentRoom.map((identity) => (
          <TimelineItem
            key={identity}
            identity={identity}
            type={identity === sessionId ? 'current' : 'other'}
          />
        ))}
      </div>
    </RootPortal>
  )
}

const NameModalContent = () => {
  const { dismiss } = useCurrentModal()
  const setDisplayName = useSetAtom(presenceStoredNameAtom)
  const formRef = useRef<FormContextType>(null)
  const title = useAggregationSelector((s) => s.seo.title)

  const providers = useAuthProviders()

  return (
    <div className="flex flex-col gap-2">
      <p>记录下你的名字，为了更好的记录当前的文章的阅读进度。</p>
      <small className="text-sm opacity-60">你的名字只会保存在本地。</small>
      <Form
        onSubmit={() => {
          const values = formRef.current?.getCurrentValues()
          const name = values?.name

          setDisplayName(name)
          dismiss()
        }}
        ref={formRef}
        className="space-y-3 text-right"
      >
        <div className="flex items-center gap-2">
          <FormInput
            autoFocus
            rules={[
              {
                validator(value) {
                  if (!value) return false
                  if (value.length > 20) return false
                  return true
                },
                message: '名字不能为空，且长度不能超过 20 个字符',
              },
            ]}
            name="name"
          />
          <div className="shrink-0">
            <StyledButton>保存</StyledButton>
          </div>
        </div>
      </Form>

      {providers && Object.keys(providers).length > 0 && (
        <Fragment>
          <p className="mt-3">
            或者，选择登录到 <b>{title}</b>，你的名字将会自动使用你的账号名字。
          </p>

          <ul className="mt-6 flex items-center justify-center gap-3 pb-16 md:pb-3">
            {Object.keys(providers).map((provider) => (
              <li key={provider}>
                <MotionButtonBase
                  onClick={() => signIn(provider)}
                  className="flex size-10 items-center justify-center rounded-full border border-base-content/10"
                >
                  {provider === 'github' ? (
                    <GitHubBrandIcon />
                  ) : (
                    <img
                      className="size-4"
                      src={`https://authjs.dev/img/providers/${provider}.svg`}
                    />
                  )}
                </MotionButtonBase>
              </li>
            ))}
          </ul>
        </Fragment>
      )}
    </div>
  )
}
export const DisplayNameHelper = ({ displayName }: { displayName: string }) => {
  const { present } = useModalStack()
  // if (displayName) return null

  return (
    <RootPortal>
      <MotionButtonBase
        onClick={() => {
          present({
            title: '告诉我你的名字吧',
            content: NameModalContent,
          })
        }}
        className={clsx(
          'border-border center fixed bottom-5 left-5 z-10 flex size-5 rounded-full border bg-base-100/80 text-2xl',
          'animation-wave hover:motion-preset-shake',
        )}
      >
        👋🏻
      </MotionButtonBase>
    </RootPortal>
  )
}

interface TimelineItemProps {
  identity: string
  type: 'current' | 'other'
}
const TimelineItem: FC<TimelineItemProps> = memo(({ type, identity }) => {
  const presence = useActivityPresenceBySessionId(identity)

  const reader = useAuthReader(presence?.readerId || '')

  const readPercent = useReadPercent()
  const isCurrent = type === 'current'

  const position = useDeferredValue(
    isCurrent ? readPercent : presence?.position,
  )
  const isDark = useIsDark()
  const bgColor = useMemo(() => {
    if (type === 'current') return ''
    if (!presence) return ''
    return getColorScheme(stringToHue(presence.identity))[
      isDark ? 'dark' : 'light'
    ].accent
  }, [isDark, presence, type])
  if (!presence) return null

  if (typeof position !== 'number') return null
  const readingDuration =
    presence && presence.operationTime - presence.joinedAt > 0
      ? formatSeconds((presence.operationTime - presence.joinedAt) / 1000)
      : ''

  return (
    <FloatPopover
      asChild
      placement="right"
      offset={30}
      strategy="fixed"
      type="tooltip"
      triggerElement={
        <MoitonBar
          bgColor={bgColor}
          isCurrent={isCurrent}
          position={position}
          data-identity={presence?.identity}
        >
          <div className="absolute left-5 top-full mt-1 whitespace-nowrap text-xs duration-200 group-hover:visible group-hover:left-5 group-hover:opacity-80 hover:!left-3">
            {presence?.displayName && (
              <>
                {presence.displayName} <br />
              </>
            )}
            {readingDuration}
          </div>

          {reader?.image && (
            <div className="group center absolute left-full top-1/2 size-8 -translate-y-1/2 duration-200">
              <a
                target="_blank"
                className="center flex size-full"
                rel="noopener noreferrer"
                href={getUserUrl({
                  provider: reader.provider,
                  handle: reader.handle,
                })}
              >
                <Avatar.Root>
                  <Avatar.Image
                    src={reader.image}
                    className="ml-2 size-5 rounded-full duration-200 animate-in fade-in group-hover:size-6"
                  />
                  <Avatar.Fallback />
                </Avatar.Root>
              </a>
            </div>
          )}
        </MoitonBar>
      }
    >
      {isCurrent ? (
        <p>你在这里。</p>
      ) : (
        <p>
          读者{' '}
          {reader?.name ||
            presence?.displayName ||
            (presence?.identity && generateRandomName(presence?.identity))}{' '}
          在这里。
        </p>
      )}
      <p>阅读进度 {position}%</p>

      {readingDuration && <p>阅读了 {readingDuration}</p>}
    </FloatPopover>
  )
})

TimelineItem.displayName = 'TimelineItem'

const MoitonBar = forwardRef<
  HTMLDivElement,
  {
    position: number
    bgColor: string
    isCurrent: boolean
  } & PropsWithChildren
>(({ bgColor, isCurrent, position, children, ...rest }, ref) => {
  const elRef = useRef<HTMLDivElement>(null)

  const [memoedPosition] = useState(position)
  useLayoutEffect(() => {
    const el = elRef.current
    if (!el) return
    el.style.top = `${memoedPosition}%`
  }, [memoedPosition])

  const animateRef = useRef<Animation | null>(null)
  useEffect(() => {
    if (isCurrent) {
      return
    }
    const el = elRef.current
    if (!el) return

    if (animateRef.current) animateRef.current.finish()
    animateRef.current = el.animate(
      [
        {
          filter: 'blur(5px)',
        },
        {
          top: `${position}%`,
          filter: 'blur(0px)',
        },
      ],
      {
        duration: 200,
        fill: 'forwards',
        easing: 'ease-in-out',
      },
    )
  }, [isCurrent, position])

  useImperativeHandle(ref, () => elRef.current!)
  return (
    <div
      aria-label={isCurrent ? '你在这里' : `读者在这里 - ${position}%`}
      ref={elRef}
      className={clsx(
        'absolute h-2 -translate-x-4 rounded-full bg-accent duration-200 group-hover:w-10 group-hover:opacity-80 hover:-translate-x-2 hover:opacity-100',
        isCurrent ? 'w-9 opacity-40 group-hover:opacity-100' : 'w-8 opacity-20',
      )}
      style={{
        top: isCurrent ? `${position}%` : void 0,
        backgroundColor: bgColor,
      }}
      {...rest}
    >
      {children}
    </div>
  )
})

MoitonBar.displayName = 'MoitonBar'

function generateRandomName(seed: string): string {
  const feedback = seed.charAt(0).toUpperCase() + seed.charAt(1)
  // 找到 seed 中的第一个字母字符
  const firstAlphabetChar = seed.split('').find((char) => /[A-Z]/i.test(char))
  if (!firstAlphabetChar) {
    return feedback
  }

  // 计算 seed 的简单哈希值
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // 确定使用哪个名字数组
  const nameList = (names as any)[firstAlphabetChar.toUpperCase()]
  if (!nameList) {
    return feedback
  }

  // 使用哈希值来选择名字数组中的一个名字
  const index = hash % nameList.length
  return nameList[index]
}
