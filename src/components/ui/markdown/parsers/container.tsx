'use client'

import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority } from 'markdown-to-jsx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { clsxm } from '~/lib/helper'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { Banner } from '../../banner/Banner'
import { Gallery } from '../../gallery/Gallery'
import { Markdown } from '../Markdown'
import { GridMarkdownImage, GridMarkdownImages } from '../renderers/image'
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
  'masonry',
].join('|')

export const ContainerRule: MarkdownToJSX.Rule = {
  match: (source: string) => {
    const result =
      /^\s*::: *(?<type>.*?) *(?:\{(?<params>.*?)\} *)?\n(?<content>[\s\S]+?)\s*::: *(?:\n *)+/.exec(
        source,
      )

    if (!result) return null

    const { type } = result.groups!
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
            <WrappedElementProvider className="w-full">
              <Markdown
                value={content}
                allowsScript
                className="w-full [&>p:first-child]:mt-0"
              />
            </WrappedElementProvider>
          </Banner>
        )
      }
      case 'banner': {
        if (!params) {
          break
        }

        return (
          <Banner type={params} className="my-4" key={state?.key}>
            <WrappedElementProvider className="w-full">
              <Markdown
                value={content}
                allowsScript
                className="w-full [&>p:first-child]:mt-0"
              />
            </WrappedElementProvider>
          </Banner>
        )
      }

      case 'grid': {
        // cols=2,gap=4,rows=2,type=images

        const { cols, gap = 8, rows, type = 'normal' } = parseParams(params)

        const Grid: Component = ({ children, className }) => (
          <div
            className={clsxm('relative grid w-full', className)}
            style={{
              gridTemplateColumns: cols
                ? `repeat(${cols}, minmax(0, 1fr))`
                : undefined,
              gap: `${gap}px`,
              gridTemplateRows: rows
                ? `repeat(${rows}, minmax(0, 1fr))`
                : undefined,
            }}
          >
            {children}
          </div>
        )
        switch (type) {
          case 'normal': {
            return (
              <Grid key={state?.key}>
                <Markdown
                  overrides={{
                    img: GridMarkdownImage,
                  }}
                  value={content}
                  allowsScript
                  removeWrapper
                  className="w-full [&>p:first-child]:mt-0"
                />
              </Grid>
            )
          }
          case 'images': {
            const imagesSrc = pickImagesFromMarkdown(content).map((r) => r.url)

            return (
              <GridMarkdownImages
                height={rows && cols ? +rows / +cols : 1}
                key={state.key}
                imagesSrc={imagesSrc}
                Wrapper={Grid}
              />
            )
          }
          default: {
            return null
          }
        }
      }
      case 'masonry': {
        const { gap = 8 } = parseParams(params)
        const imagesSrc = pickImagesFromMarkdown(content).map((r) => r.url)

        return (
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 2,
            }}
          >
            <Masonry gutter={`${gap}px`} className="[&_figure]:my-0">
              {imagesSrc.map((src) => (
                <GridMarkdownImage key={src} src={src} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
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

type ParsedResult = Record<string, string>

function parseParams(input: string): ParsedResult {
  const regex = /(\w+)=(\w+)/g
  let match: RegExpExecArray | null
  const result: ParsedResult = {}

  while ((match = regex.exec(input)) !== null) {
    const key = match[1]
    const value = match[2]
    result[key] = value
  }

  return result
}
