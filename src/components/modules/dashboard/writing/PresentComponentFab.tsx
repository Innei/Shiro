import type { FC } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { PresentSheet } from '~/components/ui/sheet'
import { Noop } from '~/lib/noop'

export const PresentComponentFab: FC<{
  Component: FC
}> = ({ Component }) => (
  <PresentSheet content={Component}>
    <FABPortable onlyShowInMobile onClick={Noop}>
      <i className="i-mingcute-settings-6-line" />
    </FABPortable>
  </PresentSheet>
)
