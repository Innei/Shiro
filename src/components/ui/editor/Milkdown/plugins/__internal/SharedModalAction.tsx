import { useState } from 'react'
import type { NodeViewContext } from '@prosemirror-adapter/react'

import { schemaCtx } from '@milkdown/core'

import { LoadingButtonWrapper, StyledButton } from '~/components/ui/button'
import { useCurrentModal } from '~/components/ui/modal'

import { useEditorCtx } from '../../ctx'

export const SharedModalAction: Component<{
  nodeCtx: NodeViewContext
  getValue(): string | undefined

  save?: (value: string) => Promise<void> | void
}> = ({ nodeCtx, getValue, save, children }) => {
  const { getPos, view, node } = nodeCtx
  const { dismiss } = useCurrentModal()
  const ctx = useEditorCtx()

  const deleteNode = () => {
    const pos = getPos()

    if (typeof pos === 'undefined') return
    view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize))
    dismiss()
  }

  const [waiting, setWaiting] = useState(false)
  return (
    <div className="mt-4 flex justify-end space-x-2 p-2">
      {children}
      <StyledButton variant="secondary" onClick={deleteNode}>
        删除
      </StyledButton>
      <LoadingButtonWrapper isLoading={waiting}>
        <StyledButton
          onClick={async () => {
            if (save) {
              setWaiting(true)
              await save(getValue()!)
              setWaiting(false)

              dismiss()
              return
            }
            // set first firstChild text
            const pos = getPos()
            if (typeof pos === 'undefined') return
            const tr = view.state.tr

            const nextValue = getValue()!

            const nextNode = ctx!.get(schemaCtx).text(nextValue)

            tr.replaceWith(pos + 1, pos + node.nodeSize, nextNode)
            view.dispatch(tr)

            dismiss()
          }}
        >
          保存
        </StyledButton>
      </LoadingButtonWrapper>
    </div>
  )
}
