import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'

import { jotaiStore } from './store'

export function urlBuilder(path = '') {
  return new URL(path, jotaiStore.get(aggregationDataAtom)?.url.webUrl)
}
