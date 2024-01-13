import React, { Fragment } from 'react'
import { Priority } from 'markdown-to-jsx'
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

  'grid',
].join('|')

export const ContainerRule: MarkdownToJSX.Rule = {
  match: (source: string) => {
    const result =
      /^\s*::: *(?<type>.*?) *(?:{(?<params>.*?)})? *\n(?<content>[\s\S]+?)\s*::: *(?:\n *)+\n?/.exec(
        source,
      )

    if (!result) return null

    const type = result.groups!.type
    if (!type || !type.match(shouldCatchContainerName)) return null
    return result
  },
  order: Priority.MED,
  parse(capture) {
    const { groups } = capture
    return {
      node: { ...groups },
    }
  },

  react(node, _, state) {
    const { type, params, content } = node.node

    console.log('container', type, params, content)
    switch (type) {
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
          note: 'info',
        }
        return (
          <Banner
            type={(transformMap as any)[type] || type}
            className="my-4"
            key={state?.key}
          >
            <Markdown
              value={content}
              as={Fragment}
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

      case 'grid': {
        // cols=2,gap=4

        const cols = params?.match(/cols=(?<cols>\d+)/)?.groups?.cols || 2
        const gap = params?.match(/gap=(?<gap>\d+)/)?.groups?.gap || 4
        return (
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }}
            key={state?.key}
          >
            <Markdown
              value={content}
              allowsScript
              removeWrapper
              className="w-full [&>p:first-child]:mt-0"
            />
          </div>
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
