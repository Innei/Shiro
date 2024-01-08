import type { FC } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { PresentSheet } from '~/components/ui/sheet'
import { Noop } from '~/lib/noop'

export const PresentComponentFab: FC<{
  Component: FC
}> = ({ Component }) => {
  return (
    <PresentSheet content={Component}>
      <FABPortable onlyShowInMobile onClick={Noop}>
        <i className="icon-[mingcute--settings-6-line]" />
      </FABPortable>
    </PresentSheet>
  )
}
