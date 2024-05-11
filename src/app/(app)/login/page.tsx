'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { AuthnUtils } from '~/lib/authn'
import { setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { Routes } from '~/lib/route-builder'

const canLoginPromise = apiClient.proxy.user('allow-login').get<{
  password: boolean
  passkey: boolean
}>()
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const { passkey: canPasskey, password: canPassword } = use(canLoginPromise)

  const handleLogin = useEventCallback(async (e?: any) => {
    e?.preventDefault()
    const { login } = await import('~/atoms/owner')
    await login(username, password)

    const redirectPath = new URLSearchParams(location.search).get('redirect')
    if (redirectPath) {
      router.push(decodeURIComponent(redirectPath))
    } else {
      router.push(Routes.Home)
    }
  })

  useEffect(() => {
    if (canPasskey) {
      AuthnUtils.validate().then((res) => {
        if (res?.token) {
          setToken(res.token)
          handleLogin()
        }
      })
    }
  }, [canPasskey, handleLogin])

  return (
    <div className="center flex min-h-[calc(100vh-7rem)] flex-col">
      <div className="mb-6 text-lg font-medium">
        你发现了神秘的登录入口
        {!canPassword ? '，但这里什么也没有' : ''}
      </div>
      {canPassword && (
        <form className="flex flex-col space-y-5" onSubmit={handleLogin}>
          <Input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />

          <div className="center flex">
            <StyledButton
              disabled={!username || !password}
              onClick={handleLogin}
            >
              Login
            </StyledButton>
          </div>
        </form>
      )}
    </div>
  )
}
