import { atom } from 'jotai'

export interface OwnerStatus {
  desc: string
  emoji: string
  icon?: string
  untilAt: number
}
export const statusAtom = atom<OwnerStatus | null>(null)
