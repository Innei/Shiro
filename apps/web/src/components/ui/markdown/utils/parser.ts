import type { MarkdownToJSX } from 'markdown-to-jsx'

function parseInline(
  parse: MarkdownToJSX.NestedParser,
  children: string,
  state: MarkdownToJSX.State,
): MarkdownToJSX.ParserResult[] {
  const isCurrentlyInline = state.inline || false
  const isCurrentlySimple = state.simple || false
  state.inline = true
  state.simple = true
  const result = parse(children, state)
  state.inline = isCurrentlyInline
  state.simple = isCurrentlySimple
  return result
}

export const parseCaptureInline: MarkdownToJSX.Parser<{
  children: MarkdownToJSX.ParserResult[]
}> = (capture, parse, state: MarkdownToJSX.State = {}) => {
  return {
    children: parseInline(parse, capture[2], state),
  }
}

export function simpleInlineRegex(regex: RegExp) {
  return allowInline(function match(
    source: string,
    state: MarkdownToJSX.State,
  ) {
    if (state.inline || state.simple) {
      return regex.exec(source)
    } else {
      return null
    }
  })
}

export function blockRegex(regex: RegExp) {
  return function match(source: string, state: MarkdownToJSX.State) {
    if (state.inline || state.simple) {
      return null
    } else {
      return regex.exec(source)
    }
  }
}

export function allowInline<T extends Function & { inline?: 0 | 1 }>(fn: T) {
  fn.inline = 1

  return fn
}
