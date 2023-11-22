import type { DocumentComponent } from 'storybook/typings'

import { LinkCardSource } from './enums'
import { LinkCard } from './LinkCard'

export const LinkCardDemo1: DocumentComponent = () => {
  return <LinkCard id="notes/145" source={LinkCardSource.MixSpace} />
}

LinkCardDemo1.meta = {
  description: 'Show Mix Space Note LinkCard',
  title: 'LinkCard - Mix Space Note',
}
export const LinkCardDemo2: DocumentComponent = () => {
  return <LinkCard id="innei/innei" source={LinkCardSource.GHRepo} />
}

LinkCardDemo2.meta = {
  description: 'Show Github Repo LinkCard',
  title: 'LinkCard - GitHub Repo',
}

export const LinkCardDemo3: DocumentComponent = () => {
  return <LinkCard id="notes/1451" source={LinkCardSource.MixSpace} />
}

LinkCardDemo3.meta = {
  description: 'Error LinkCard',
  title: 'LinkCard - Error',
}

export const LinkCardDemo4: DocumentComponent = () => {
  return <LinkCard id="innei/shiro/132" source={LinkCardSource.GHPr} />
}

LinkCardDemo4.meta = {
  description: 'Show Github PR LinkCard',
  title: 'LinkCard - GitHub PR',
}

export const LinkCardDemo5: DocumentComponent = () => {
  return (
    <LinkCard
      id="innei/shiro/commit/0bf51cd8cf8457a2666906dea4a333081fc2a2b8"
      source={LinkCardSource.GHCommit}
    />
  )
}

LinkCardDemo5.meta = {
  description: 'Show Github Commit LinkCard',
  title: 'LinkCard - GitHub Commit',
}
