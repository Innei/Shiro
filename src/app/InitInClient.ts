'use client'

import { cheatVueDevtools } from 'bypass-vue-devtools'
import { useEffect } from 'react'

import { init } from './init'

init()

export const InitInClient = () => {
  useEffect(() => {
    cheatVueDevtools()
  }, [])
  return null
}
