import { MotionButtonBase } from '~/components/ui/button'
import { clsxm } from '~/lib/helper'

import { useSayModal } from './hooks'

export const CreateSayButton: Component = ({ className }) => {
  const present = useSayModal()
  return (
    <MotionButtonBase
      onClick={() => present()}
      className={clsxm(
        'flex size-8 duration-200 center hover:text-accent',
        className,
      )}
    >
      <i className="i-mingcute-add-circle-line" />
    </MotionButtonBase>
  )
}
