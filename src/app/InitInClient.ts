'use client'

import { cheatVueDevtools } from 'bypass-vue-devtools'

import { isClientSide } from '~/lib/env'

import { init } from './init'

init()

if (isClientSide) {
  cheatVueDevtools()
}
export const InitInClient = () => {
  return null
}
