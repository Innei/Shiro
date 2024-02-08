/* eslint-disable react/display-name */
'use client'

import { useEffect, useMemo } from 'react'

import { nanoid } from '@milkdown/utils'

import { StyledButton } from '~/components/ui/button'
import { apiClient } from '~/lib/request'
import { socketClient } from '~/socket'
import { EventTypes, SocketEmitEnum } from '~/types/events'

export default () => {
  const roomName = useMemo(() => nanoid(), [])
  const userId = useMemo(() => nanoid(), [])
  const update = () => {
    apiClient.activity.proxy('update-presence').post({
      data: {
        userId,
        position: (Math.random() * 100) | 0,
        ts: Date.now(),
        roomName,
      },
    })
  }
  useEffect(() => {
    socketClient.emit(SocketEmitEnum.Join, {
      roomName,
    })

    window.addEventListener(
      `event:${EventTypes.ACTIVITY_UPDATE_PRESENCE}`,
      (e) => {
        console.log(e, 'EventTypes.ACTIVITY_UPDATE_PRESENCE')
      },
    )

    return () => {
      socketClient.emit(SocketEmitEnum.Leave, {
        roomName,
      })
    }
  }, [roomName, userId])
  return <StyledButton onClick={update}>update</StyledButton>
}
