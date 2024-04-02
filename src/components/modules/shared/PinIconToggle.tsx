'use client'

import type { MouseEventHandler, SVGProps } from 'react'

import { useIsLogged } from '~/atoms/hooks'
import { MotionButtonBase } from '~/components/ui/button'
import { IconTransition } from '~/components/ui/transition/IconTransition'
import { clsxm } from '~/lib/helper'

export const PinIconToggle: Component<{
  pin: boolean

  onPinChange: (pin: boolean) => void
}> = ({ className, pin, onPinChange }) => {
  const isLogged = useIsLogged()

  const handlePin: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    onPinChange(!pin)
  }
  return (
    <MotionButtonBase
      aria-label="Pin this post"
      className={clsxm(
        'absolute bottom-0 right-0 top-[4px] z-10 -m-5 box-content hidden size-5 items-center p-5',
        isLogged &&
          'inline-flex cursor-pointer opacity-50 transition-opacity hover:opacity-100',
        !isLogged && pin && 'pointer-events-none',
        pin && '!inline-flex text-uk-red-light opacity-100',
        className,
      )}
      onClick={handlePin}
    >
      <IconTransition
        currentState={pin ? 'solid' : 'regular'}
        regularIcon={<PhPushPin />}
        solidIcon={<PhPushPinFill />}
      />
    </MotionButtonBase>
  )
}

export function PhPushPinFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="m232 107.3l-58.5 58.5c4.5 12.7 6.4 33.9-13.2 60a16.3 16.3 0 0 1-11.7 6.4h-1.1a16.1 16.1 0 0 1-11.3-4.7L88 179.3l-34.3 34.4a8.2 8.2 0 0 1-11.4 0a8.1 8.1 0 0 1 0-11.4L76.7 168l-48.4-48.4a15.9 15.9 0 0 1 1.3-23.8C55 75.3 79.3 79.4 90 82.7L148.7 24a16.1 16.1 0 0 1 22.6 0L232 84.7a15.9 15.9 0 0 1 0 22.6Z"
      />
    </svg>
  )
}

export function PhPushPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M236.7 96a15.9 15.9 0 0 0-4.7-11.3L171.3 24a16.1 16.1 0 0 0-22.6 0L90 82.7c-10.7-3.3-35-7.4-60.4 13.1a15.9 15.9 0 0 0-1.3 23.8L76.7 168l-34.4 34.3a8.1 8.1 0 0 0 0 11.4a8.2 8.2 0 0 0 11.4 0L88 179.3l48.2 48.2a16.1 16.1 0 0 0 11.3 4.7h1.1a16.3 16.3 0 0 0 11.7-6.4c19.6-26.1 17.7-47.3 13.2-60l58.5-58.5a15.9 15.9 0 0 0 4.7-11.3Zm-78.4 62.3a8.2 8.2 0 0 0-1.5 9.3c9.5 18.9-1.8 38.6-9.3 48.6L39.6 108.3C51.7 98.5 63.3 96 72.1 96s15.9 2.9 16.3 3.2a8.2 8.2 0 0 0 9.3-1.5L160 35.3L220.7 96Z"
      />
    </svg>
  )
}
