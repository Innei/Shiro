import { memo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useIsLogged } from '~/atoms/hooks'
import { TrackerAction } from '~/constants/tracker'

type ImpressionProps = {
  trackerMessage?: string
  action?: TrackerAction
  onTrack?: () => any
}
export const ImpressionView: Component<
  { shouldTrack?: boolean } & ImpressionProps
> = (props) => {
  const { shouldTrack = true, ...rest } = props
  if (!shouldTrack) {
    return <>{props.children}</>
  }
  return <ImpressionViewImpl {...rest} />
}

const ImpressionViewImpl: Component<ImpressionProps> = memo((props) => {
  const [impression, setImpression] = useState(false)
  const isLogged = useIsLogged()
  const { ref } = useInView({
    initialInView: false,
    triggerOnce: true,
    onChange(inView) {
      if (inView) {
        setImpression(true)

        if (isLogged) {
          return
        }
        document.dispatchEvent(
          new CustomEvent('impression', {
            detail: {
              action: props.action ?? TrackerAction.Impression,
              label: props.trackerMessage,
            },
          }),
        )

        props.onTrack?.()
      }
    },
  })

  return (
    <>
      {props.children}
      {!impression && <span ref={ref} />}
    </>
  )
})

ImpressionViewImpl.displayName = 'ImpressionView'
