import type { DocumentComponent } from 'storybook/typings'

import { MilkdownEditor } from './Milkdown'

// :::warning
// _here be dragons_
// :::

// :::banner {error}
// _here be dragons_
// :::

// :::gallery
// https://loremflickr.com/640/480/city?1
// https://loremflickr.com/640/480/city?2
// https://loremflickr.com/640/480/city?3
// ![](https://loremflickr.com/640/480/city?4 'Image')
// :::

export const EditorDemo: DocumentComponent = () => {
  return (
    <MilkdownEditor
      initialMarkdown={`::iframe{src="https://saul-mirone.github.io"}
      
      
      

~~11~~

1111111111111112222222222 ~~22222~~ **a** aaaaaaaaaaaa..

:::grid[cols=3,gap=4]

Grid 1

Grid 2

Grid 3

https://loremflickr.com/640/480/city?1

https://loremflickr.com/640/480/city?2

https://loremflickr.com/640/480/city?3

![](https://loremflickr.com/640/480/city?4 'Image')

![](https://loremflickr.com/640/480/city?4 'Image')

![](https://loremflickr.com/640/480/city?4 'Image')


`}
    />
  )
}

EditorDemo.meta = {
  title: 'Editor',
}
