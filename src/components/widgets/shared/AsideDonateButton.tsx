import { DialogContent, DialogPortal, Root } from '@radix-ui/react-dialog'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { HTMLMotionProps } from 'framer-motion'

import { MotionButtonBase } from '~/components/ui/button'
import { DialogOverlay } from '~/components/ui/dlalog/DialogOverlay'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useConfig } from '~/hooks/data/use-config'
import { clsxm } from '~/lib/helper'

// TODO this component only use once in current page.
const positionAtom = atom({
  x: 0,
  y: 0,
})
const overlayShowAtom = atom(false)

export const AsideDonateButton = () => {
  const isClient = useIsClient()
  const {
    module: { donate },
  } = useConfig()

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
  )
}

const DonateButtonInternal: Component<HTMLMotionProps<'button'>> = ({
  className,

  ...props
}) => {
  const {
    module: { donate },
  } = useConfig()

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
      <i className="icon-[mingcute--teacup-line] text-[24px] opacity-80 duration-200 hover:text-uk-brown-dark hover:opacity-100" />
    </MotionButtonBase>
  )
}
