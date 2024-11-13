import { domMax, LazyMotion } from 'motion/react'
import * as React from 'react'
import type { DocumentComponent } from 'storybook/typings'

import { StyledButton } from '../button'
import { CollapseContent } from './Collapse'

export const CollapseDemo1: DocumentComponent = () => {
  const [opened, setOpened] = React.useState(false)
  return (
    <LazyMotion features={domMax}>
      <StyledButton onClick={() => setOpened((opened) => !opened)}>
        Toggle Collapse
      </StyledButton>
      <CollapseContent isOpened={opened}>
        <p>
          Maiores occaecati quis animi nihil debitis. Iure suscipit animi.
          Repellat quia quas harum possimus dolorum dolore ullam eius. Tenetur
          aut saepe illo expedita culpa. Nisi asperiores doloribus facere
          eveniet ad tempore nemo accusantium in. Possimus eum dolorum a aliquid
          unde dolore corporis. Voluptatem quibusdam ipsam numquam. Vero aliquid
          odit reiciendis amet cum sapiente commodi. Natus in ullam dignissimos
          sed eos accusantium. Quis eligendi aliquid. Cumque possimus sed
          suscipit vero. Repellendus inventore quo porro necessitatibus totam.
        </p>
      </CollapseContent>
    </LazyMotion>
  )
}

CollapseDemo1.meta = {
  title: 'Normal Collapse',
}

export const CollapseDemo2: DocumentComponent = () => {
  const [opened, setOpened] = React.useState(false)
  return (
    <LazyMotion features={domMax}>
      <StyledButton onClick={() => setOpened((opened) => !opened)}>
        Toggle Collapse
      </StyledButton>
      <CollapseContent isOpened={opened} withBackground>
        <p>
          Maiores occaecati quis animi nihil debitis. Iure suscipit animi.
          Repellat quia quas harum possimus dolorum dolore ullam eius. Tenetur
          aut saepe illo expedita culpa. Nisi asperiores doloribus facere
          eveniet ad tempore nemo accusantium in. Possimus eum dolorum a aliquid
          unde dolore corporis. Voluptatem quibusdam ipsam numquam. Vero aliquid
          odit reiciendis amet cum sapiente commodi. Natus in ullam dignissimos
          sed eos accusantium. Quis eligendi aliquid. Cumque possimus sed
          suscipit vero. Repellendus inventore quo porro necessitatibus totam.
        </p>
      </CollapseContent>
    </LazyMotion>
  )
}

CollapseDemo2.meta = {
  title: 'With Background Collapse',
}
