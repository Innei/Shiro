import { LabelSwitch } from '~/components/ui'
import { useI18n } from '~/i18n/hooks'

import { usePostModelSingleFieldAtom } from '../data-provider'

export const PostCombinedSwitch = () => {
  const [copyright, setCopyright] = usePostModelSingleFieldAtom('copyright')
  const [pin, setPin] = usePostModelSingleFieldAtom('pin')
  const [isPublished, setIsPublished] =
    usePostModelSingleFieldAtom('isPublished')

  const [allowComment, setAllowComment] =
    usePostModelSingleFieldAtom('allowComment')

  const t = useI18n()
  return (
    <>
      <LabelSwitch
        checked={copyright}
        label={t('common.copyright')}
        onCheckedChange={setCopyright}
      />

      <LabelSwitch checked={isPublished} onCheckedChange={setIsPublished}>
        <span>{t('common.should-published')}</span>
      </LabelSwitch>

      <LabelSwitch checked={pin} onCheckedChange={setPin}>
        <span>{t('common.pin')}</span>
      </LabelSwitch>

      <LabelSwitch checked={allowComment} onCheckedChange={setAllowComment}>
        <span>{t('common.allow-comment')}</span>
      </LabelSwitch>
    </>
  )
}
