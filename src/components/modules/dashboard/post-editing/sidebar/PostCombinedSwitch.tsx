import { LabelSwitch } from '~/components/ui/switch'

import { usePostModelSingleFieldAtom } from '../data-provider'

export const PostCombinedSwitch = () => {
  const [copyright, setCopyright] = usePostModelSingleFieldAtom('copyright')
  const [pin, setPin] = usePostModelSingleFieldAtom('pin')

  const [allowComment, setAllowComment] =
    usePostModelSingleFieldAtom('allowComment')

  return (
    <>
      <LabelSwitch
        checked={copyright}
        label="版权信息"
        onCheckedChange={setCopyright}
      />

      <LabelSwitch
        checked={!!pin}
        onCheckedChange={(pin) => {
          setPin(pin ? new Date().toISOString() : null)
        }}
      >
        <span>置顶</span>
      </LabelSwitch>

      <LabelSwitch checked={allowComment} onCheckedChange={setAllowComment}>
        <span>允许评论</span>
      </LabelSwitch>
    </>
  )
}
