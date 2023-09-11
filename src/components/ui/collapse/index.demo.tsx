import React from 'react'
import { domMax, LazyMotion } from 'framer-motion'
import type { DocumentComponent } from 'storybook/typings'

import { StyledButton } from '../button'
import { Collapse } from './Collapse'

export const CollapseDemo1: DocumentComponent = () => {
  const [opened, setOpened] = React.useState(false)
  return (
    <LazyMotion features={domMax}>
      <StyledButton onClick={() => setOpened((opened) => !opened)}>
        Toggle Collapse
      </StyledButton>
      <Collapse isOpened={opened}>
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
      </Collapse>
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
      <Collapse isOpened={opened} withBackground>
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
      </Collapse>
    </LazyMotion>
  )
}

CollapseDemo2.meta = {
  title: 'With Background Collapse',
}
