'use client'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useModalStack } from '~/components/ui/modal'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { AuthnUtils } from '~/lib/authn'

interface AuthnModel {
  name: string

  credentialID: string
  credentialPublicKey: string
  counter: number
  credentialDeviceType: 'singleDevice' | 'multiDevice'
  credentialBackedUp: boolean
}

export default () => {
  // const { data: passkeys } = useQuery({
  //   queryKey: ['passkey', 'items'],
  //   queryFn: () => {
  //     return apiClient.proxy.passkey.items.get<AuthnModel[]>()
  //   },
  // })
  const { present } = useModalStack()

  return (
    <div className="flex gap-2">
      <StyledButton
        onClick={() => {
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
