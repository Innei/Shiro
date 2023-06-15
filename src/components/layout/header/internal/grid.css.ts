import { style } from '@vanilla-extract/css'

export const headerGrid = style({
  gridTemplateAreas: "'left center right'",
})

export const headerLogoGrid = style({
  gridArea: 'left',
})

export const headerCenterGrid = style({
  gridArea: 'center',
})

export const headerRightGrid = style({
  gridArea: 'right',
})
