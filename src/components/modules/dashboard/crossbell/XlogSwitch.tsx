import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAtom, useStore } from 'jotai'

import { XLogIcon } from '~/components/icons/platform/XLogIcon'
import { LabelSwitch } from '~/components/ui/switch'
import { PublishEvent } from '~/events'
import { RefetchEvent } from '~/events/refetch'
import { apiClient } from '~/lib/request'

import { syncToXlogAtom } from '../writing/atoms'
import { CrossBellConnector } from './legacy'

export const XlogSwitch = () => {
  const [checked, setChecked] = useAtom(syncToXlogAtom)

  const { data: siteId, isLoading } = useQuery({
    queryKey: ['xlog', 'conf'],
    queryFn: async () => {
      const { data } =
        await apiClient.proxy.options.thirdPartyServiceIntegration.get<{
          data: { xLogSiteId: string }
        }>()
      const { xLogSiteId } = data

      const CrossBellConnector = await import('./legacy').then(
        (mo) => mo.CrossBellConnector,
      )
      CrossBellConnector.setSiteId(xLogSiteId)
      return xLogSiteId
    },
  })

  if (!siteId && !isLoading) {
    setChecked(false)
  }

  return (
    <LabelSwitch
      disabled={!siteId}
      checked={!siteId ? false : checked}
      onCheckedChange={setChecked}
    >
      <span className="flex items-center gap-2">
        同步到 XLog <XLogIcon className="h-5 w-5" />
      </span>
      <PublishEventSubscriber />
    </LabelSwitch>
  )
}

const PublishEventSubscriber = () => {
  const store = useStore()
  useEffect(() => {
    window.addEventListener(PublishEvent.type, (e: Event) => {
      const ev = e as PublishEvent

      const enabled = store.get(syncToXlogAtom)
      if (!enabled) return

      CrossBellConnector.createOrUpdate(ev.data).then(() => {
        window.dispatchEvent(new RefetchEvent())
      })
    })
  }, [store])

  return null
}
