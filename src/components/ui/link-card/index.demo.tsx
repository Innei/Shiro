import type { DocumentComponent } from 'storybook/typings'

import { LinkCard } from './LinkCard'

export const LinkCardDemo1: DocumentComponent = () => {
  return <LinkCard id="notes/145" source="mx-space" />
}

LinkCardDemo1.meta = {
  description: 'Show Mix Space Note LinkCard',
  title: 'LinkCard - Mix Space Note',
}
export const LinkCardDemo2: DocumentComponent = () => {
  return <LinkCard id="innei/innei" source="gh" />
}

LinkCardDemo2.meta = {
  description: 'Show Github Repo LinkCard',
  title: 'LinkCard - GitHub Repo',
}

export const LinkCardDemo3: DocumentComponent = () => {
  return <LinkCard id="notes/1451" source="mx-space" />
}

LinkCardDemo3.meta = {
  description: 'Error LinkCard',
  title: 'LinkCard - Error',
}
