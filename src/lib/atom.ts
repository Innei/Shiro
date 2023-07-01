/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { Atom } from 'jotai'

export const createAtomSelector = <T>(atom: Atom<T>) => {
  const hook = <R>(selector: (a: T) => R, deps: any[] = []) =>
    useAtomValue(
      selectAtom(
        atom,
        useCallback((a) => selector(a as T), deps),
      ),
    )

  hook.__atom = atom
  return hook
}
