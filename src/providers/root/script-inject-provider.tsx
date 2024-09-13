import Script from 'next/script'

import { fetchAggregationData } from '~/app/(app)/api'

export const ScriptInjectProvider = async () => {
  const { theme } = await fetchAggregationData()
  const { scripts, css, js, styles } = theme.config.custom || {}

  return (
    <>
      {css && (
        <style
          id="shiro-custom-css"
          dangerouslySetInnerHTML={{
            __html: css.join('\n'),
          }}
        />
      )}
      {js && (
        <script
          id="shiro-custom-js"
          dangerouslySetInnerHTML={{
            __html: js.join('\n'),
          }}
        />
      )}
      {styles?.map((style) => (
        <link key={style} rel="stylesheet" href={style} />
      ))}
      {scripts?.map((props) => {
        const nextProps = { ...props } as any
        const dataKeys = Object.keys(props).filter((key) =>
          /data[A-Z]/.test(key),
        )

        for (const key of dataKeys) {
          const newKey = key.replaceAll(/([A-Z])/g, '-$1').toLowerCase()
          nextProps[newKey] = nextProps[key]
          delete nextProps[key]
        }

        return <Script key={props.src} {...nextProps} />
      })}
    </>
  )
}
