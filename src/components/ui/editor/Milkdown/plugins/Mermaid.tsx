import { useNodeViewContext } from '@prosemirror-adapter/react'
import { useEffect, useRef } from 'react'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { ModalContentPropsInternal } from '~/components/ui/modal'
import type { FC } from 'react'
import type { PluginCtx } from './types'

import { diagramSchema } from '@milkdown/plugin-diagram'
import { $view } from '@milkdown/utils'

import { Mermaid } from '~/components/modules/shared/Mermaid'
import { StyledButton } from '~/components/ui/button'
import { TextArea } from '~/components/ui/input'
import { useModalStack } from '~/components/ui/modal'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'

const autoOpenValue = '<auto_open>'

const MermaidRender = () => {
  const { contentRef, node, setAttrs, view, getPos } = useNodeViewContext()

  const value = node.attrs.value
  const autoOpen = value === autoOpenValue

  const modalStack = useModalStack()

  const handleEdit = () => {
    const Content: FC<ModalContentPropsInternal> = ({ dismiss }) => {
      const deleteNode = () => {
        const pos = getPos()
        if (typeof pos === 'undefined') return
        view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize))
        dismiss()
      }
      const defaultValue = value === autoOpenValue ? '' : value
      const [, getValue, ref] =
        useUncontrolledInput<HTMLTextAreaElement>(defaultValue)
      return (
        <div className="flex h-[450px] max-h-[80vh] w-[60ch] max-w-full flex-col">
          <TextArea
            defaultValue={defaultValue}
            className="flex-grow"
            ref={ref}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <StyledButton variant="secondary" onClick={deleteNode}>
              删除
            </StyledButton>
            <StyledButton
              onClick={() => {
                setAttrs({
                  value: getValue(),
                })
                dismiss()
              }}
            >
              保存
            </StyledButton>
          </div>
        </div>
      )
    }
    modalStack.present({
      title: 'Edit Diagram',
      content: Content,
    })
  }

  const openOnceRef = useRef(false)

  useEffect(() => {
    if (!autoOpen) return

    if (openOnceRef.current) return

    openOnceRef.current = true
    setAttrs({
      value: '',
    })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        handleEdit()
      })
    })
  }, [])
  if (!value || autoOpen) {
    return (
      <div
        ref={contentRef}
        className="my-4 flex h-12 w-full max-w-full cursor-pointer rounded bg-slate-100 text-sm center dark:bg-neutral-800"
        onClick={handleEdit}
        contentEditable={false}
      >
        Empty Diagram, Click to edit
      </div>
    )
  }
  return (
    <div
      ref={contentRef}
      className="my-4 max-w-full cursor-pointer [&_*]:!select-none"
      onClick={handleEdit}
      contentEditable={false}
    >
      <div className="pointer-events-none">
        <Mermaid content={value} />
      </div>
    </div>
  )
}

export const MermaidPlugin: (pluginCtx: PluginCtx) => MilkdownPlugin[] = ({
  nodeViewFactory,
}) => [
  $view(diagramSchema.node, () =>
    nodeViewFactory({
      component: MermaidRender,
    }),
  ),
]
