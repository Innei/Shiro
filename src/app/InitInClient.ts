'use client'

import { useEffect } from 'react'
import { cheatVueDevtools } from 'bypass-vue-devtools'

import { init } from './init'

init()

export const InitInClient = () => {
  useEffect(() => {
    cheatVueDevtools()
  }, [])
  return null
}
