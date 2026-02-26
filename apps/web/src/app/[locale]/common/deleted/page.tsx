import { getTranslations } from 'next-intl/server'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'
import { Link } from '~/i18n/navigation'

export default async function PageDeleted() {
  const t = await getTranslations('error')
  return (
    <NormalContainer>
      <div className="mt-[250px] flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{t('page_deleted')}</h1>

        <StyledButton className="mt-8">
          <Link href="/">{t('back_home')}</Link>
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
