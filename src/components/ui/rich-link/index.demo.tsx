import type { DocumentComponent } from 'storybook/typings'

import { Favicon } from './Favicon'
import { SocialSourceLink } from './SocialSourceLink'

export const RichLinkDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <SocialSourceLink source="GH" name="Innei" />
      <SocialSourceLink source="TW" name="__oQuery" />
    </div>
  )
}

RichLinkDemo.meta = {
  title: 'Rich Link',
}

export const FaviconsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <Favicon source="GH" />
      <Favicon source="TW" />
      <Favicon source="TG" />
      <Favicon source="BL" />
      <Favicon source="Npm" />
    </div>
  )
}

FaviconsDemo.meta = {
  title: 'Favicons with source',
}

export const FaviconsDemo2: DocumentComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <Favicon href="https://t.me/" />
      <Favicon href="https://x.com" />
      <Favicon href="https://twitter.com" />
      <Favicon href="https://bilibili.com" />
      <Favicon href="https://www.npmjs.com" />
    </div>
  )
}

FaviconsDemo2.meta = {
  title: 'Favicons with link',
}
