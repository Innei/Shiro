'use client'

import Script from 'next/script'

import { useAppConfigSelector } from './aggregation-data-provider'

export const ScriptInjectProvider = () => {
  const scripts = useAppConfigSelector((config) => config.custom?.scripts)
  if (!scripts) return null
  return (
    <>
      {scripts.map((props) => {
        const nextProps = { ...props } as any
        const dataKeys = Object.keys(props).filter((key) =>
          /data[A-Z]/.test(key),
        )

        for (const key of dataKeys) {
          const newKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          nextProps[newKey] = nextProps[key]
          delete nextProps[key]
        }

        return <Script key={props.src} {...nextProps} />
      })}
    </>
  )
}
