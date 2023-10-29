import React from 'react'
import { blockRegex, Priority } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import { Banner } from '../../banner/Banner'
import { Gallery } from '../../gallery/Gallery'
import { Markdown } from '../Markdown'
import { pickImagesFromMarkdown } from '../utils/image'

const shouldCatchContainerName = [
  'gallery',
  'banner',
  'carousel',

  'warn',
  'error',
  'danger',
  'info',
  'success',
  'warning',
  'note',
].join('|')

export const ContainerRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(
      `^\\s*::: *(?<name>(${shouldCatchContainerName})) *({(?<params>(.*?))})? *\n(?<content>[\\s\\S]+?)\\s*::: *(?:\n *)+\n?`,
    ),
  ),
  order: Priority.MED,
  parse(capture) {
    const { groups } = capture
    return {
      ...groups,
    }
  },
  // @ts-ignore
  react(node, _, state) {
    const { name, content, params } = node

    switch (name) {
      case 'carousel':
      case 'gallery': {
        return (
          <Gallery key={state?.key} images={pickImagesFromMarkdown(content)} />
        )
      }
      case 'warn':
      case 'error':
      case 'danger':
      case 'info':
      case 'note':
      case 'success':
      case 'warning': {
        const transformMap = {
          warning: 'warn',
          danger: 'error',
        }
        return (
          <Banner
            type={name || (transformMap as any)[name] || 'info'}
            className="my-4"
            key={state?.key}
          >
            <Markdown
              value={content}
              allowsScript
              className="w-full [&>p:first-child]:mt-0"
            />
          </Banner>
        )
      }
      case 'banner': {
        if (!params) {
          break
        }

        return (
          <Banner type={params} className="my-4" key={state?.key}>
            <Markdown
              value={content}
              allowsScript
              className="w-full [&>p:first-child]:mt-0"
            />
          </Banner>
        )
      }
    }

    return (
      <div key={state?.key}>
        <p>{content}</p>
      </div>
    )
  },
}

/**
 * gallery container
 *
 * ::: gallery
 * ![name](url)
 * ![name](url)
 * ![name](url)
 * :::
 */
