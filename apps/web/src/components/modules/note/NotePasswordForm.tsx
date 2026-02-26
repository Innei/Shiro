'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'

export const NotePasswordForm = () => {
  const t = useTranslations('note')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const existingPassword = url.searchParams.get('password')

    if (existingPassword) {
      setError(true)
      return
    }
  }, [])
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!password) return

    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('password', password)
    window.location.href = `${window.location.pathname}?${searchParams.toString()}`
  }

  return (
    <div className="center flex h-[calc(100vh-15rem)] flex-col space-y-4">
      {t('password_required')}
      <form
        onSubmit={handleSubmit}
        className="center mt-8 flex flex-col space-y-4"
      >
        <Input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          type="password"
          placeholder={t('password_placeholder')}
          aria-label={t('password_placeholder')}
        />
        {error && (
          <span className="text-sm text-red-500">{t('password_error')}</span>
        )}
        <StyledButton disabled={!password} type="submit" variant="primary">
          {t('password_submit')}
        </StyledButton>
      </form>
    </div>
  )
}
