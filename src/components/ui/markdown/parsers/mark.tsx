import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import React from 'react'

//  ==Mark==
export const MarkRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^==((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)==/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <mark
        key={state?.key}
        className="!bg-always-yellow-200 !rounded-lg !bg-opacity-80 !bg-none !text-black"
      >
        {output(node.content, state!)}
      </mark>
    )
  },
}
