'use client'

import { useState } from 'react'

import { apiClient } from '~/lib/request'

import { PinIconToggle } from '../shared/PinIconToggle'

export const PostPinIcon = ({ pin, id }: { pin: boolean; id: string }) => {
  const [pinState, setPinState] = useState(pin)
  return (
    <PinIconToggle
      onPinChange={async (nextPin) => {
        await apiClient.post.proxy(id).patch({
          data: {
            pin: nextPin,
          },
        })
        setPinState(nextPin)
      }}
      pin={pinState}
    />
  )
}
