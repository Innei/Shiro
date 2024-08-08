import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { FC } from 'react'
import { useRef } from 'react'

import type { GalleryImageType } from '../Gallery'
import styles from './FullScreenGallery.module.css'

export const FullScreenGallery: FC<{ images: GalleryImageType[] }> = (
  props,
) => {
  const { images } = props
  const prevScrolltopRef = useRef(0)
  useIsomorphicLayoutEffect(() => {
    prevScrolltopRef.current = document.documentElement.scrollTop
    const $root = document.querySelector('#root') as HTMLElement
    if (!$root) return
    $root.style.display = 'none'
    document.documentElement.scrollTop = 0
    return () => {
      $root.style.display = ''

      document.documentElement.scrollTop = prevScrolltopRef.current
    }
  }, [])

  return (
    <div
      style={
        {
          '--count': images.length,
        } as any
      }
      className={styles['root']}
    >
      <aside>
        <nav>
          <ul>
            {images.map((image, index) => (
              <li key={index}>
                <a href={`#img-${index}`}>
                  <img src={image.url} alt={image.name} />
                  <span>{image.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main>
        {images.map((image, index) => (
          <figure key={index} id={`img-${index}`}>
            <img src={image.url} alt={image.name} />
            <figcaption>{image.name}</figcaption>
          </figure>
        ))}
      </main>
    </div>
  )
}
