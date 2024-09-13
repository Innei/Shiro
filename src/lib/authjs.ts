import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from 'next-auth/providers/index'
import type {
  LiteralUnion,
  SignInAuthorizationParams,
  SignInOptions,
  SignInResponse,
  SignOutParams,
  SignOutResponse,
} from 'next-auth/react'
import { getCsrfToken, getProviders } from 'next-auth/react'

import { API_URL } from '~/constants/env'

export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  provider?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams,
): Promise<
  P extends RedirectableProviderType ? SignInResponse | undefined : undefined
> {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  const providers = await getProviders()

  const baseUrl = `${API_URL}/auth`

  if (!providers) {
    window.location.href = `${baseUrl}/error`
    return
  }

  if (!provider || !(provider in providers)) {
    window.location.href = `${baseUrl}/signin?${new URLSearchParams({
      callbackUrl,
    })}`
    return
  }

  const isCredentials = providers[provider].type === 'credentials'
  const isEmail = providers[provider].type === 'email'
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = `${baseUrl}/${
    isCredentials ? 'callback' : 'signin'
  }/${provider}`

  const _signInUrl = `${signInUrl}${authorizationParams ? `?${new URLSearchParams(authorizationParams)}` : ''}`

  const res = await fetch(_signInUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    credentials: 'include',
    // @ts-expect-error
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  })

  const data = await res.json()

  // TODO: Do not redirect for Credentials and Email providers by default in next major
  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes('#')) window.location.reload()
    return
  }

  const error = new URL(data.url).searchParams.get('error')

  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as any
}

export async function signOut<R extends boolean = true>(
  options?: SignOutParams<R>,
): Promise<R extends true ? undefined : SignOutResponse> {
  const { callbackUrl = window.location.href } = options ?? {}
  const baseUrl = `${API_URL}/auth`
  const fetchOptions: RequestInit = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    credentials: 'include',
    // @ts-expect-error
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  }
  const res = await fetch(`${baseUrl}/signout`, fetchOptions)
  const data = await res.json()

  if (options?.redirect ?? true) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes('#')) window.location.reload()
    // @ts-expect-error
    return
  }

  return data
}

export const getUserUrl = <
  T extends { handle?: string; provider: string | BuiltInProviderType },
>(
  user: T,
) => {
  if (!user.handle) return
  switch (user.provider) {
    case 'github': {
      return `https://github.com/${user.handle}`
    }
  }

  return
}
