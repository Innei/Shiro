'use client'

import { useInView } from 'react-intersection-observer'

import { clsxm } from '~/lib/helper'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

export const Signature = () => {
  const signature = useAppConfigSelector((state) => state.module.signature?.svg)
  const { ref, inView } = useInView()
  if (!signature) return null

  return (
    <div
      ref={ref}
      className={clsxm(
        'signature-animated my-2 flex w-full justify-end',
        !inView && 'animate-pause',
      )}
      data-hide-print
      key={inView ? 'signature' : 'signature-pause'}
      dangerouslySetInnerHTML={{
        __html: signature,
      }}
    />
  )
}
