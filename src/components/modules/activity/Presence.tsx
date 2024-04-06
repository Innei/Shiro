'use client'

import { useQuery } from '@tanstack/react-query'
import {
  forwardRef,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import type { FC, PropsWithChildren } from 'react'

import { useUser } from '@clerk/nextjs'

import {
  useActivityPresenceByRoomName,
  useActivityPresenceBySessionId,
  useIsLogged,
  useIsMobile,
  useOwner,
  useSocketSessionId,
} from '~/atoms/hooks'
import { getServerTime } from '~/components/common/SyncServerTime'
import { FloatPopover } from '~/components/ui/float-popover'
import { RootPortal } from '~/components/ui/portal'
import { EmitKeyMap } from '~/constants/keys'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { getColorScheme, stringToHue } from '~/lib/color'
import { formatSeconds } from '~/lib/datetime'
import { safeJsonParse } from '~/lib/helper'
import { debounce, uniq } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { queries } from '~/queries/definition'
import { socketWorker } from '~/socket/worker-client'

import { commentStoragePrefix } from '../comment/CommentBox/providers'
import names from './names.json'
import { useRoomContext } from './Room'

export const Presence = () => {
  const isClient = useIsClient()

  return isClient ? <PresenceImpl /> : null
}

const PresenceImpl = () => {
  const { roomName } = useRoomContext()
  const isMobile = useIsMobile()
  const { refetch } = useQuery({
    ...queries.activity.presence(roomName),

    refetchOnMount: true,
    refetchInterval: 30_000,
  })

  const identity = useSocketSessionId()

  const clerkUser = useUser()
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
  const displayName = useMemo(
    () =>
      isOwnerLogged
        ? owner?.name
        : clerkUser.isSignedIn
          ? clerkUser.user.fullName
          : commentStoredName || '',
    [
      clerkUser.isSignedIn,
      clerkUser.user?.fullName,
      commentStoredName,
      isOwnerLogged,
      owner?.name,
    ],
  )

  const update = useCallback(
    debounce(async (position: number) => {
      const sid = await socketWorker.getSid()
      if (!sid) return
      apiClient.activity.updatePresence({
        identity,
        position,
        sid,
        roomName,
        displayName: displayName || void 0,
        ts: getServerTime().getTime() || Date.now(),
      })
    }, 1000),
    [identity, displayName],
  )

  const percent = useReadPercent()

  const updateWithPercent = useEventCallback(() => update(percent))

  useEffect(() => {
    const handler = () => {
      refetch()
      updateWithPercent()
    }
    window.addEventListener(EmitKeyMap.SocketConnected, handler)

    return () => {
      window.removeEventListener(EmitKeyMap.SocketConnected, handler)
    }
  }, [refetch, updateWithPercent])

  useEffect(() => {
    update(percent)
  }, [percent, update])

  if (isMobile) return null

  return <ReadPresenceTimeline />
}

const ReadPresenceTimeline = () => {
  const sessionId = useSocketSessionId()

  const { roomName } = useRoomContext()
  const activityPresenceIdsCurrentRoom = useActivityPresenceByRoomName(roomName)

  const uniqueActivityPresenceIdsCurrentRoom = uniq(
    activityPresenceIdsCurrentRoom,
  )
  if (uniqueActivityPresenceIdsCurrentRoom.length < 2) return null
  return (
    <RootPortal>
      <div className="group fixed inset-y-20 left-0 z-[3] w-8">
        {uniqueActivityPresenceIdsCurrentRoom.map((identity) => {
          return (
            <TimelineItem
              key={identity}
              identity={identity}
              type={identity === sessionId ? 'current' : 'other'}
            />
          )
        })}
      </div>
    </RootPortal>
  )
}

interface TimelineItemProps {
  identity: string
  type: 'current' | 'other'
}
const TimelineItem: FC<TimelineItemProps> = memo(({ type, identity }) => {
  const presence = useActivityPresenceBySessionId(identity)

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
          <div className="invisible -translate-y-1 translate-x-12 whitespace-nowrap text-xs opacity-0 duration-200 group-hover:visible group-hover:opacity-80">
            {presence?.displayName} {readingDuration}
          </div>
        </MoitonBar>
      }
    >
      {isCurrent ? (
        <p>你在这里。</p>
      ) : (
        <p>
          读者{' '}
          {presence?.displayName ||
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
  const firstAlphabetChar = seed.split('').find((char) => /[A-Za-z]/.test(char))
  if (!firstAlphabetChar) {
    return feedback
  }

  // 计算 seed 的简单哈希值
  const hash = seed.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  // 确定使用哪个名字数组
  const nameList = (names as any)[firstAlphabetChar.toUpperCase()]
  if (!nameList) {
    return feedback
  }

  // 使用哈希值来选择名字数组中的一个名字
  const index = hash % nameList.length
  return nameList[index]
}
