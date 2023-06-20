'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'

import {
  IcRoundKeyboardDoubleArrowLeft,
  IcRoundKeyboardDoubleArrowRight,
} from '~/components/icons/arrow'
import { MdiClockTimeThreeOutline } from '~/components/icons/clock'
import { Divider } from '~/components/ui/divider'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { useNoteByNidQuery } from '~/hooks/data/use-note'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { springScrollToTop } from '~/utils/scroller'

export const NoteFooterNavigation: FC<{ noteId: string }> = ({
  noteId: id,
}) => {
  const { data } = useNoteByNidQuery(id)

  const router = useRouter()

  if (!data) return null

  const { prev, next } = data
  const prevNid = prev?.nid
  const nextNid = next?.nid

  return (
    <>
      {/* // 没有 0 的情况 */}
      {(!!prevNid || !!nextNid) && (
        <>
          <Divider className="!w-15 m-auto" />
          <section className="relative mt-4 py-2 text-center" data-hide-print>
            <div className="flex items-center justify-between [&>*]:inline-flex [&>*]:items-center [&>*]:space-x-2 [&>*]:px-2 [&>*]:py-2">
              {!!nextNid && (
                <Link
                  href={routeBuilder(Routes.Note, {
                    id: nextNid.toString(),
                  })}
                  className="hover:text-primary"
                  scroll={false}
                  prefetch={false}
                >
                  <IcRoundKeyboardDoubleArrowLeft />
                  <span>前一篇</span>
                </Link>
              )}

              {!!prevNid && (
                <Link
                  href={routeBuilder(Routes.Note, {
                    id: prevNid.toString(),
                  })}
                  prefetch={false}
                  scroll={false}
                  className="hover:text-primary"
                >
                  <span>后一篇</span>
                  <IcRoundKeyboardDoubleArrowRight />
                </Link>
              )}
            </div>
            <div
              tabIndex={1}
              role="button"
              className="absolute bottom-0 left-1/2 top-0 flex -translate-x-1/2 transform items-center space-x-2 text-accent opacity-80 hover:text-primary"
              onClick={() => {
                springScrollToTop()
                router.push(
                  routeBuilder(Routes.Timelime, {
                    type: 'note',
                    selectId: id,
                  }),
                )
              }}
            >
              <span>时间线</span>
              <MdiClockTimeThreeOutline />
            </div>
          </section>
        </>
      )}
    </>
  )
}

export const NoteFooterNavigationBarForMobile: typeof NoteFooterNavigation = (
  props,
) => {
  return (
    <OnlyMobile>
      <NoteFooterNavigation {...props} />
    </OnlyMobile>
  )
}
