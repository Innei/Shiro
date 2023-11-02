import { DialogContent, DialogPortal, Root } from '@radix-ui/react-dialog'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { HTMLMotionProps } from 'framer-motion'

import { ImpressionView } from '~/components/common/ImpressionTracker'
import { MotionButtonBase } from '~/components/ui/button'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { TrackerAction } from '~/constants/tracker'
import { useIsClient } from '~/hooks/common/use-is-client'
import { clsxm } from '~/lib/helper'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

import { ActionAsideIcon } from './ActionAsideContainer'

// TODO this component only use once in current page.
const positionAtom = atom({
  x: 0,
  y: 0,
})
const overlayShowAtom = atom(false)

export const AsideDonateButton = () => {
  const isClient = useIsClient()
  const donate = useAppConfigSelector((config) => config.module?.donate)

  const overlayOpen = useAtomValue(overlayShowAtom)

  if (!isClient) return null
  if (!donate || !donate.enable) return null

  return (
    <>
      <DonateButtonBelow />
      <Root open={overlayOpen}>
        <DialogPortal forceMount>
          <div>
            <AnimatePresence>
              {overlayOpen && (
                <>
                  <DialogOverlay />
                  <DialogContent className="fixed inset-0 z-[11] flex flex-wrap space-x-4 overflow-auto center">
                    {donate.qrcode.map((src) => (
                      <m.img
                        exit={{ opacity: 0 }}
                        src={src}
                        alt="donate"
                        className="h-[300px] max-h-[70vh]"
                        key={src}
                      />
                    ))}

                    <DonateButtonTop />
                  </DialogContent>
                </>
              )}
            </AnimatePresence>
          </div>
        </DialogPortal>
      </Root>
    </>
  )
}

const DonateButtonBelow = () => {
  const setPosition = useSetAtom(positionAtom)
  const setOverlayShow = useSetAtom(overlayShowAtom)
  return (
    <DonateButtonInternal
      onMouseEnter={(e) => {
        const $el = e.target as HTMLButtonElement
        const rect = $el.getBoundingClientRect()
        setPosition({
          x: rect.left,
          y: rect.top,
        })
        setOverlayShow(true)
      }}
    />
  )
}

const DonateButtonTop = () => {
  const setOverlayShow = useSetAtom(overlayShowAtom)
  const buttonPos = useAtomValue(positionAtom)
  return (
    <ImpressionView
      trackerMessage="Donate Show"
      action={TrackerAction.Impression}
    >
      <DonateButtonInternal
        className="focus-visible:text-uk-brown-light focus-visible:!shadow-none"
        style={{
          position: 'fixed',
          left: buttonPos.x,
          top: buttonPos.y,
          zIndex: 999,
          margin: 0,
        }}
        onMouseLeave={() => {
          setOverlayShow(false)
        }}
      />
    </ImpressionView>
  )
}

const DonateButtonInternal: Component<HTMLMotionProps<'button'>> = ({
  className,

  ...props
}) => {
  const donate = useAppConfigSelector((config) => config.module.donate)
  if (!donate) return null
  return (
    <MotionButtonBase
      aria-label="Donate to author"
      className={clsxm('flex flex-col space-y-2', className)}
      onClick={() => {
        window.open(donate.link, '_blank')
      }}
      {...props}
    >
      <ActionAsideIcon className="icon-[mingcute--teacup-line] hover:text-uk-brown-dark" />
    </MotionButtonBase>
  )
}
