import { useQuery } from '@tanstack/react-query'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useCurrentModal, useModalStack } from '~/components/ui/modal'
import { RelativeTime } from '~/components/ui/relative-time'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { AuthnUtils } from '~/lib/authn'
import { apiClient } from '~/lib/request'
import { queryClient } from '~/providers/root/react-query-provider'

export const Component = () => {
  const { present } = useModalStack()
  return (
    <>
      <div className="flex justify-end gap-2">
        <StyledButton variant="secondary" onClick={() => AuthnUtils.validate()}>
          Verify Passkey
        </StyledButton>
        <StyledButton
          onClick={() =>
            present({
              title: 'Create Passkey',
              content: PasskeyModal,
            })
          }
        >
          Create Passkey
        </StyledButton>
      </div>

      <PasskeyList />
    </>
  )
}

const PasskeyModal = () => {
  const [, getName, ref] = useUncontrolledInput()
  const { dismiss } = useCurrentModal()
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const name = getName()
        if (!name) return
        AuthnUtils.createPassKey(name).then(() => {
          dismiss()
          queryClient.invalidateQueries({ queryKey: ['passkeys'] })
        })
      }}
    >
      <label className="text-sm" htmlFor="name">
        Name
      </label>
      <Input autoFocus ref={ref} id="name" type="text" />
      <div className="flex justify-end">
        <StyledButton type="submit">Create</StyledButton>
      </div>
    </form>
  )
}

const PasskeyList = () => {
  const { data } = useQuery({
    queryKey: ['passkeys'],
    queryFn: () =>
      apiClient.proxy.passkey.items.get<
        {
          id: string
          name: string
          credentialID: string
          credentialPublicKey: string
          counter: number
          credentialDeviceType: string
          credentialBackedUp: boolean
          created: string
          updatedAt: string
        }[]
      >(),
  })

  return (
    <table className="table table-fixed">
      <thead>
        <tr>
          <th>Name</th>
          <th>Credential ID</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.credentialID}</td>
            <td>
              <RelativeTime date={item.created} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
