'use client'

import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

export const Signature = () => {
  const signature = useAppConfigSelector((state) => state.module.signature?.svg)

  if (!signature) return null

  return (
    <div
      className="signature-animated my-2 flex w-full justify-end"
      dangerouslySetInnerHTML={{
        __html: signature,
      }}
    />
  )
}
