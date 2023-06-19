'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { login } from '~/atoms/owner'
import { MotionButtonBase } from '~/components/ui/button'
import { Routes } from '~/lib/route-builder'

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: any) => {
    e.preventDefault()
    login(username, password).then(() => {
      router.push(Routes.Home)
    })
  }
  return (
    <div className="flex min-h-[calc(100vh-7rem)] center">
      <form className="flex flex-col space-y-5" onSubmit={handleLogin}>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          className="input w-full max-w-xs"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="input w-full max-w-xs"
        />

        <div className="flex center">
          <MotionButtonBase
            disabled={!username || !password}
            className="btn-primary btn text-white"
            onClick={handleLogin}
          >
            Login
          </MotionButtonBase>
        </div>
      </form>
    </div>
  )
}
