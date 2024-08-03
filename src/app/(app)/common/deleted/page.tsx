import Link from 'next/link'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default async function PageDeleted() {
  return (
    <NormalContainer>
      <div className="mt-[250px] flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">This page is deleted</h1>

        <StyledButton className="mt-8">
          <Link href="/">Back to Home</Link>
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
