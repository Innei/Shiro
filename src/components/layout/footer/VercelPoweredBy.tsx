'use client'

import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

const isVercelEnv = !!process.env.NEXT_PUBLIC_VERCEL_ENV
export const VercelPoweredBy = () => {
  const isSettingToDisplay = useAppConfigSelector(
    (s) => s.poweredBy?.vercel || false,
  )

  const shouldDisplay = isVercelEnv && isSettingToDisplay

  if (!shouldDisplay) {
    return null
  }
  return (
    <img
      src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg"
      className="h-10 cursor-pointer object-contain"
      alt="Powered by Vercel"
      tabIndex={0}
      onClick={() => {
        window.open('https://vercel.com/?utm_source=innei&utm_campaign=oss')
      }}
    />
  )
}
