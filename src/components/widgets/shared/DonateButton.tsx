import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useConfig } from '~/hooks/data/use-config'

export const DonateButton = () => {
  const isClient = useIsClient()
  const {
    module: { donate },
  } = useConfig()
  if (!isClient) return null
  if (!donate || !donate.enable) return null

  return (
    <FloatPopover TriggerComponent={TriggerComponent} placement="left-end">
      <div className="flex flex-wrap space-x-2 center">
        {donate.qrcode.map((src) => (
          <img
            src={src}
            alt="donate"
            className="h-[300px] max-h-[70vh]"
            key={src}
          />
        ))}
      </div>
    </FloatPopover>
  )
}

const TriggerComponent = () => {
  const {
    module: { donate },
  } = useConfig()

  if (!donate) return null
  return (
    <MotionButtonBase
      className="flex flex-col space-y-2"
      onClick={() => {
        window.open(donate.link, '_blank')
      }}
    >
      <i className="icon-[material-symbols--coffee] text-[24px] opacity-80 duration-200 hover:text-uk-brown-dark hover:opacity-100" />
    </MotionButtonBase>
  )
}
