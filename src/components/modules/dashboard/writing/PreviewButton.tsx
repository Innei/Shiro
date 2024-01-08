import { useEffect } from 'react'

import { StyledButton } from '~/components/ui/button'
import { EmitKeyMap } from '~/constants/keys'
import { debounce } from '~/lib/_'

export const PreviewButton = <T extends { id: string }>(props: {
  getData: () => T
}) => {
  const storageKey = `preview-${props.getData().id}`
  const handlePreview = async () => {
    const url = new URL('/preview', location.origin)
    url.searchParams.set('same-site', '1')
    url.searchParams.set('storageKey', storageKey)

    const finalUrl = url.toString()
    localStorage.setItem(storageKey, JSON.stringify(props.getData()))
    window.open(finalUrl)
  }

  useEffect(() => {
    const handler = debounce(() => {
      localStorage.setItem(storageKey, JSON.stringify(props.getData()))
    }, 100)
    window.addEventListener(EmitKeyMap.EditDataUpdate, handler)
    handler()

    return () => {
      window.removeEventListener(EmitKeyMap.EditDataUpdate, handler)
      localStorage.removeItem(storageKey)
    }
  })

  return (
    <StyledButton
      variant="secondary"
      className="rounded-lg"
      onClick={handlePreview}
    >
      预览
    </StyledButton>
  )
}
