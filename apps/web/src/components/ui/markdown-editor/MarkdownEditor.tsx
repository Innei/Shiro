'use client'

import './MarkdownEditor.css'

import { CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import type { EditorState, LexicalEditor } from 'lexical'
import { $getRoot, COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from 'lexical'
import type { MutableRefObject, ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'

import { clsxm } from '~/lib/helper'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  autoFocus?: boolean
  scrollIntoView?: boolean
  className?: string
  contentClassName?: string
  actions?: ReactNode
  onEditorReady?: (editor: LexicalEditor | null) => void
}

const editorNodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
]

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  onSubmit,
  autoFocus,
  scrollIntoView,
  className,
  contentClassName,
  actions,
  onEditorReady,
}: MarkdownEditorProps) => {
  const initialValueRef = useRef(value)
  const lastMarkdownRef = useRef(value)

  const initialConfig = useMemo(
    () => ({
      namespace: 'markdown-editor',
      nodes: editorNodes,
      onError(error: Error) {
        throw error
      },
      editorState: () => {
        if (!initialValueRef.current) return
        $convertFromMarkdownString(
          initialValueRef.current,
          TRANSFORMERS,
          undefined,
          true,
        )
      },
    }),
    [],
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={clsxm('markdown-editor', className)}>
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              spellCheck
              aria-label="Markdown editor"
              className={clsxm('markdown-editor__content', contentClassName)}
            />
          }
          placeholder={
            placeholder ? (
              <span className="markdown-editor__placeholder">
                {placeholder}
              </span>
            ) : null
          }
        />

        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              const markdown = $convertToMarkdownString(
                TRANSFORMERS,
                undefined,
                true,
              )
              if (markdown === lastMarkdownRef.current) return
              lastMarkdownRef.current = markdown
              onChange(markdown)
            })
          }}
        />
        <EditorRefPlugin
          onEditorReady={(editor) => {
            onEditorReady?.(editor)
          }}
        />
        <MarkdownSyncPlugin lastMarkdownRef={lastMarkdownRef} value={value} />
        {!!onSubmit && <SubmitShortcutPlugin onSubmit={onSubmit} />}
        {!!autoFocus && (
          <AutoFocusPlugin
            autoFocus={autoFocus}
            scrollIntoView={scrollIntoView}
          />
        )}

        {actions}
      </div>
    </LexicalComposer>
  )
}

const EditorRefPlugin = ({
  onEditorReady,
}: {
  onEditorReady?: (editor: LexicalEditor | null) => void
}) => {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    onEditorReady?.(editor)
    return () => {
      onEditorReady?.(null)
    }
  }, [editor, onEditorReady])
  return null
}

const SubmitShortcutPlugin = ({ onSubmit }: { onSubmit: () => void }) => {
  const [editor] = useLexicalComposerContext()
  useEffect(
    () =>
      editor.registerCommand<KeyboardEvent>(
        KEY_ENTER_COMMAND,
        (event) => {
          if (!(event.metaKey || event.ctrlKey)) return false
          event.preventDefault()
          onSubmit()
          return true
        },
        COMMAND_PRIORITY_HIGH,
      ),
    [editor, onSubmit],
  )
  return null
}

const MarkdownSyncPlugin = ({
  value,
  lastMarkdownRef,
}: {
  value: string
  lastMarkdownRef: MutableRefObject<string>
}) => {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (value === lastMarkdownRef.current) return
    lastMarkdownRef.current = value
    editor.update(() => {
      const root = $getRoot()
      root.clear()
      if (!value) return
      $convertFromMarkdownString(value, TRANSFORMERS, undefined, true)
    })
  }, [editor, lastMarkdownRef, value])
  return null
}

const AutoFocusPlugin = ({
  autoFocus,
  scrollIntoView,
}: {
  autoFocus: boolean
  scrollIntoView?: boolean
}) => {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (!autoFocus) return
    editor.focus()
    if (scrollIntoView) {
      const rootElement = editor.getRootElement()
      rootElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [editor, autoFocus, scrollIntoView])
  return null
}
