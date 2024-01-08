import { atomWithStorage } from 'jotai/utils'

import { buildNSKey } from '~/lib/ns'

export const syncToXlogAtom = atomWithStorage(buildNSKey('sync-to-xlog'), true)
