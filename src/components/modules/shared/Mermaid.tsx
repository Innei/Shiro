import { useEffect, useId, useState } from 'react'
import type { FC } from 'react'

import { useIsDark } from '~/hooks/common/use-is-dark'
import { useWrappedElementSize } from '~/providers/shared/WrappedElementProvider'

import { FixedZoomedImage } from '../../ui/image'
import { BlockLoading } from './BlockLoading'

export const Mermaid: FC<{
  content: string
}> = (props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [svg, setSvg] = useState('')
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()

  const isDark = useIsDark()

  useEffect(() => {
    import('mermaid').then(async (mo) => {
      const mermaid = mo.default

      mermaid.initialize({
        theme: isDark ? 'dark' : 'default',
      })
    })
  }, [isDark])

  const id = useId().split(':').join('')

  useEffect(() => {
    if (!props.content) {
      return
    }
    setError('')
    setLoading(true)

    let isCanceled = false

    import('mermaid').then(async (mo) => {
      const mermaid = mo.default

      let result
      try {
        result = await mermaid.render(`mermaid-${id}`, props.content)
      } catch (error) {
        document.getElementById(`dmermaid-${id}`)?.remove()
        if (error instanceof Error) {
          setError(error.message)
        }
        setSvg('')
        setWidth(undefined)
        setHeight(undefined)
      }

      if (isCanceled) return

      if (result) {
        setSvg(result.svg)

        const match = result.svg.match(/viewBox="[^"]*\s([\d.]+)\s([\d.]+)"/)
        if (match?.[1] && match?.[2]) {
          setWidth(parseInt(match?.[1]))
          setHeight(parseInt(match?.[2]))
        }
        setError('')
      }
      setLoading(false)
      return () => {
        isCanceled = true
      }
    })
  }, [id, props.content])
  const { w } = useWrappedElementSize()

  const encoder = new TextEncoder()
  const data = encoder.encode(svg)
  const base64EncodedString = btoa(String.fromCharCode(...new Uint8Array(data)))
  const imgSrc = `data:image/svg+xml;base64,${base64EncodedString}`

  return loading ? (
    <BlockLoading>Mermaid Loading...</BlockLoading>
  ) : svg ? (
    <div>
      <FixedZoomedImage
        containerWidth={w}
        src={imgSrc}
        width={width}
        height={height}
      />
    </div>
  ) : (
    <div className="flex min-h-[50px] items-center justify-center rounded-lg bg-red-100 text-sm">
      {error || 'Error'}
    </div>
  )
}
