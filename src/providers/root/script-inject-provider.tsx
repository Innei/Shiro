'use client'

import Script from 'next/script'

import { useAppConfigSelector } from './aggregation-data-provider'

export const ScriptInjectProvider = () => {
  const scripts = useAppConfigSelector((config) => config.custom?.scripts)
  if (!scripts) return null
  return (
    <>
      {scripts.map((props) => (
        <Script key={props.src} {...props} />
      ))}
    </>
  )
}
