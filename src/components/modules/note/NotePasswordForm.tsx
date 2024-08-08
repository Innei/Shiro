'use client'

import { useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'

export const NotePasswordForm = () => {
  const [password, setPassword] = useState('')
  const handleSubmit: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault()
    window.location.href = `${window.location.href}?password=${password}`
  }
  return (
    <div className="center flex h-[calc(100vh-15rem)] flex-col space-y-4">
      需要密码才能查看！
      <form className="center mt-8 flex flex-col space-y-4">
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="输入密码以查看"
          aria-label="输入密码以查看"
        />
        <StyledButton
          disabled={!password}
          type="submit"
          variant="primary"
          onClick={handleSubmit}
        >
          快给我康康！
        </StyledButton>
      </form>
    </div>
  )
}
