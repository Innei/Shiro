'use client'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useModalStack } from '~/components/ui/modal'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { AuthnUtils } from '~/lib/authn'

export default () => {
  const { present } = useModalStack()

  return (
    <div className="flex gap-2">
      <StyledButton
        onClick={() => {
          present({
            title: 'Register Passkey',
            content: Content,
          })
        }}
      >
        Register Passkey
      </StyledButton>
      <StyledButton
        onClick={() => {
          AuthnUtils.validate()
        }}
      >
        Testing Passkey
      </StyledButton>
    </div>
  )
}
const Content = () => {
  const [, getValue] = useUncontrolledInput()
  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Name" />
      <StyledButton
        onClick={() => {
          AuthnUtils.createPassKey(
            getValue() || Math.random().toString(16).slice(2),
          )
        }}
      >
        Register Passkey
      </StyledButton>
    </div>
  )
}
