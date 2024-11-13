import { DialogContent, DialogPortal, Root } from '@radix-ui/react-dialog'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { HTMLMotionProps } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { ImpressionView } from '~/components/common/ImpressionTracker'
import { RiUserHeartLine } from '~/components/icons/user-heart'
import { MotionButtonBase } from '~/components/ui/button'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { PresentSheet } from '~/components/ui/sheet'
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
                  <DialogContent className="center fixed inset-0 z-[11] flex flex-col">
                    <DonateContent />

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

  const [sheetOpen, setSheetOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <DonateButtonInternal
        onClick={() => {
          setSheetOpen(true)
        }}
        onMouseEnter={(e) => {
          if (isMobile) return
          const $el = e.target as HTMLButtonElement
          const rect = $el.getBoundingClientRect()
          setPosition({
            x: rect.left,
            y: rect.top,
          })

          setOverlayShow(true)
        }}
      />
      {isMobile && (
        <PresentSheet
          content={DonateContent}
          open={sheetOpen}
          dismissible
          onOpenChange={setSheetOpen}
        />
      )}
    </>
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
        className="text-red-400 focus-visible:!shadow-none"
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
        exit={{
          opacity: 0,
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
      <ActionAsideIcon className="hover:text-red-400">
        <RiUserHeartLine />
      </ActionAsideIcon>
    </MotionButtonBase>
  )
}

const DonateContent = () => {
  const donate = useAppConfigSelector((config) => config.module?.donate)

  return (
    <>
      <m.h2 exit={{ opacity: 0 }} className="mb-6 text-lg font-medium">
        感谢您的支持，助力梦想继续前行。
      </m.h2>
      <div className="center flex flex-wrap gap-4 overflow-auto">
        {donate?.qrcode?.map((src) => (
          <m.img
            exit={{ opacity: 0 }}
            src={src}
            alt="donate"
            className="h-[300px] max-h-[70vh]"
            key={src}
          />
        ))}
      </div>
    </>
  )
}
