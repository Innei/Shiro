import type { DocumentComponent } from 'storybook/typings'

import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { MarkdownImageRecordProvider } from '~/providers/article/markdown-image-record-provider'

import { Gallery } from './Gallery'

const genHex = () =>
  Math.floor(Math.random() * 255)
    .toString(16)
    .padStart(2, '0')
const images = Array.from({ length: 10 }).map((_, i) => ({
  src: `https://loremflickr.com/640/480/city?${i}`,
  height: 480,
  width: 640,
  type: 'image',
  accent: `#${genHex()}`,
}))

export const Demo1: DocumentComponent = () => {
  return (
    <div
      className="inline-block overflow-hidden border border-accent"
      style={{
        width: '600px',
      }}
    >
      <ArticleElementProvider>
        <MarkdownImageRecordProvider images={images}>
          <Gallery
            images={images.map((image) => ({
              ...image,
              url: image.src,
              name: image.src,
              footnote: image.src,
            }))}
          />
        </MarkdownImageRecordProvider>
      </ArticleElementProvider>
    </div>
  )
}

Demo1.meta = {
  title: 'Gallery',
  description: 'Gallery component',
}
