'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import type { FC, JSX, SVGProps } from 'react'
import type { XLogMeta } from './types'

import { CollapseContent } from '~/components/ui/collapse'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const XLogInfoForPost: FC = () => {
  const meta = useCurrentPostDataSelector((data) => data?.meta?.xLog)
  return <XLogInfoBase meta={meta} />
}

export const XLogInfoForNote: FC = () => {
  const meta = useCurrentNoteDataSelector((data) => data?.data.meta?.xLog)
  return <XLogInfoBase meta={meta} />
}

const XLogInfoBase: FC<{
  meta?: XLogMeta | null
}> = ({ meta }) => {
  const [collapse, setCollapse] = useState(false)

  const isClient = useIsClient()
  if (!isClient) return null

  if (!meta) return null

  const { metadata, pageId, cid } = meta as XLogMeta

  const sections = [] as JSX.Element[]

  if (pageId) {
    sections.push(
      <section key="pageId">
        <h4>Note ID</h4>
        <a href={`https://crossbell.io/notes/${pageId}`}>{pageId}</a>
      </section>,
    )
  }

  if (metadata?.owner) {
    sections.push(
      <section key="owner">
        <h4>Owner</h4>
        <a href={`https://scan.crossbell.io/address/${metadata.owner}`}>
          {metadata.owner}
        </a>
      </section>,
    )
  }

  if (metadata?.transactions?.length) {
    sections.push(
      <section key="transactions">
        <h4>Transaction Hash Creation</h4>
        <a href={`https://scan.crossbell.io/tx/${metadata.transactions[0]}`}>
          {metadata.transactions[0]}
        </a>
      </section>,
    )
  }

  if (metadata?.network) {
    sections.push(
      <section key="network">
        <h4>Network</h4>
        <p>{metadata.network}</p>
      </section>,
    )
  }

  if (cid) {
    sections.push(
      <section key="ipfs">
        <h4>IPFS Address</h4>
        <a href={`https://ipfs.4everland.xyz/ipfs/${cid}`}>ipfs://{cid}</a>
      </section>,
    )
  }

  return (
    <div
      className="my-6 select-none text-sm [&_h4]:font-medium [&_section]:my-2"
      data-hide-print
    >
      <div
        role="button"
        tabIndex={0}
        className={clsx(
          '-mx-2 flex w-[100%+0.5rem] items-center justify-between rounded-lg p-2 text-left transition-colors duration-300 md:rounded-xl',
          'hover:bg-zinc-200 dark:hover:bg-neutral-800',
        )}
        onClick={() => {
          setCollapse((c) => !c)
        }}
      >
        <div className="flex w-full items-center justify-between">
          <span className="flex grow items-center space-x-2">
            <SafeIcon />
            <span>
              此数据所有权由区块链加密技术和智能合约保障仅归创作者所有。
            </span>
          </span>
          <IcRoundKeyboardArrowDown
            className={clsx(
              !collapse ? '' : 'rotate-180',
              'text-lg transition-transform duration-200 ease-linear',
            )}
          />
        </div>
      </div>
      <CollapseContent isOpened={collapse}>
        <div className="text-gray-2 w-full overflow-hidden py-2 text-sm [&_a]:break-all">
          {sections}
        </div>
      </CollapseContent>
    </div>
  )
}

const SafeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18px"
    height="18px"
    viewBox="0 0 1024 1024"
  >
    <path
      fill="rgb(22 163 74)"
      d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5L214 654.3V226.7l298-101.6l298 101.6v427.6zm-405.8-201c-3-4.1-7.8-6.6-13-6.6H336c-6.5 0-10.3 7.4-6.5 12.7l126.4 174a16.1 16.1 0 0 0 26 0l212.6-292.7c3.8-5.3 0-12.7-6.5-12.7h-55.2c-5.1 0-10 2.5-13 6.6L468.9 542.4l-64.7-89.1z"
    />
  </svg>
)

const IcRoundKeyboardArrowDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"
      />
    </svg>
  )
}
