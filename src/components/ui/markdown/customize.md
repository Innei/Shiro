

## List and GFM Tasks

1. First
2. Second
   1. 2.1
   2. 2.2
      1. 3.1
3. Third
4. Fourth

- [ ] Checkbox
- [x] Checkbox Completed

---

- Line
  - Line 1.1
- Line 2

## Definition lists

Term 1

: Definition 1
with lazy continuation.

Term 2 with _inline markup_

: Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
~ Definition 1

Term 2
~ Definition 2a
~ Definition 2b

## [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

\*[HTML]: Hyper Text Markup Language

## Table

| 表达内容                                                                                                                                 | 示例          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 表示文件                                                                                                                                 | `options.txt` |
| 表示变量                                                                                                                                 | <版本名>      |
| 在文件或文件夹末尾加上 `!` 表示 Minecraft 本体，分发这些文件违反了 [Minecraft Eula](https://account.mojang.com/documents/minecraft_eula) | libraries !   |
| 在文件或文件夹末尾加上 `*` 表示可删除，`**` 表示建议删除，`***` 表示必须删除                                                             | libraries \*  |

## Token

This is a ||Spoiler||

A `code`.

==mark== it.

++Something Insert++

## Latex

$ c = \pm\sqrt{a^2 + b^2} $

## Container

### banner

```
::: warning
_here be dragons_
:::

::: banner {error}
_here be dragons_
:::
```

::: warning
_here be dragons_
:::

::: banner {error}
_here be dragons_
:::

### Gallery

```
::: gallery
https://loremflickr.com/640/480/city?1
https://loremflickr.com/640/480/city?2
https://loremflickr.com/640/480/city?3
![](https://loremflickr.com/640/480/city?4 'Image')
:::

```

::: gallery
https://loremflickr.com/640/480/city?1
https://loremflickr.com/640/480/city?2
https://loremflickr.com/640/480/city?3
![](https://loremflickr.com/640/480/city?4 'Image')
:::

### Grid

```md
::: grid {cols=3,gap=4}

Grid 1

Grid 2

Grid 3

https://loremflickr.com/640/480/city?1

https://loremflickr.com/640/480/city?2

https://loremflickr.com/640/480/city?3

![](https://loremflickr.com/640/480/city?4 'Image')

![](https://loremflickr.com/640/480/city?4 'Image')

![](https://loremflickr.com/640/480/city?4 'Image')

:::
```

::: grid {cols=3,gap=4}

Grid 1

Grid 2

Grid 3

https://loremflickr.com/640/480/city?1

https://loremflickr.com/640/480/city?2

https://loremflickr.com/640/480/city?3

![](https://loremflickr.com/640/480/city?4)

![](https://loremflickr.com/640/480/city?6)

![](https://loremflickr.com/640/480/city?40)

:::

### Images Grid

```md
::: grid {cols=2,rows=2,gap=4,type=images}
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
:::
```

::: grid {cols=3,rows=3,gap=12,type=images}
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
:::

```
::: grid {cols=3,rows=2,gap=12,type=images}
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
:::

```

::: grid {cols=3,rows=2,gap=12,type=images}
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
![](https://loremflickr.com/640/480/city?4)
:::



## Rich Link

```
https://github.com/Innei/Shiro
```

https://github.com/Innei/Shiro

```
https://twitter.com/zhizijun/status/1649822091234148352?s=20
```

https://twitter.com/zhizijun/status/1649822091234148352?s=20

```
https://www.youtube.com/watch?v=N93cTbtLCIM
```

https://www.youtube.com/watch?v=N93cTbtLCIM

```
https://gist.github.com/Innei/94b3e8f078d29e1820813a24a3d8b04e
```

https://gist.github.com/Innei/94b3e8f078d29e1820813a24a3d8b04e

```
https://github.com/vuejs/vitepress/commit/71eb11f72e60706a546b756dc3fd72d06e2ae4e2
```

https://github.com/vuejs/vitepress/commit/71eb11f72e60706a546b756dc3fd72d06e2ae4e2

```
https://codesandbox.io/s/framer-motion-layoutroot-prop-forked-p39g96
```

https://codesandbox.io/s/framer-motion-layoutroot-prop-forked-p39g96

```
https://github.com/Innei/Shiro/blob/108d4c3e927e1c9c9304e41a0631f91958477d9f/src/providers/root/modal-stack-provider.tsx
```

https://github.com/Innei/Shiro/blob/108d4c3e927e1c9c9304e41a0631f91958477d9f/src/providers/root/modal-stack-provider.tsx

```
https://github.com/Innei/Shiro/pull/129
```

https://github.com/Innei/Shiro/pull/129

```
https://github.com/Innei/Shiro/commit/6957e011439eb2d3cbf42bfb67ed81b07d4bcc2a
```

https://github.com/Innei/Shiro/commit/6957e011439eb2d3cbf42bfb67ed81b07d4bcc2a

```
https://trpc.io/docs/client/react/useInfiniteQuery
```

https://trpc.io/docs/client/react/useInfiniteQuery

```
[TRPC](https://trpc.io/docs/client/react/useInfiniteQuery)
```

[TRPC](https://trpc.io/docs/client/react/useInfiniteQuery)

## LinkCard

```
<LinkCard source="gh" id="mx-space/kami">
```

<LinkCard source="gh" id="mx-space/kami">

```
<LinkCard source="gh-commit" id="mx-space/kami/commit/e1eee4136c21ab03ab5690e17025777984c362a0">
```

<LinkCard source="gh-commit" id="mx-space/kami/commit/e1eee4136c21ab03ab5690e17025777984c362a0">

## Inline Link Parser

```
Inline [Innei](https://github.com/Innei)
```

Inline [Innei](https://github.com/Innei)

```
Inline [pseudoyu](https://twitter.com/pseudo_yu)
```

Inline [pseudoyu](https://twitter.com/pseudo_yu)

```
Inline <https://github.com/Innei>
```

Inline <https://github.com/Innei>

```
Inline https://github.com/Innei
```

Inline https://github.com/Innei

## Mention

```
[Innei]{GH@Innei}
```

[Innei 太菜了]{GH@Innei}

## Alerts

```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.

<div />

> [!TIP]
> Helpful advice for doing things better or more easily.

<div />

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

<div />

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

<div />

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

```

> [!NOTE]
> Useful information that users should know, even when skimming content.

<div />

> [!TIP]
> Helpful advice for doing things better or more easily.

<div />

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

<div />

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

<div />

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## KateX

```
$ c = \pm\sqrt{a^2 + b^2} $
```

$ c = \pm\sqrt{a^2 + b^2} $

```
$c = \pm\sqrt{a^2 + b^2}$
```

$c = \pm\sqrt{a^2 + b^2}$

$P(x) = a_nx^n+a_{n-1}x^{n-1} + \dots + a_1x + a_0$

```
$P(x) = a_nx^n+a_{n-1}x^{n-1} + \dots + a_1x + a_0$
```

```
$$

P\left(U,T\right)=100\left.\left(0.6\min\left(1,\frac{U-0.70}{0.90-0.70}\right)+0.4\min\left(1,\frac{T-4000}{14000-4000}\right)\right)\right.

$$
```

$$

P\left(U,T\right)=100\left.\left(0.6\min\left(1,\frac{U-0.70}{0.90-0.70}\right)+0.4\min\left(1,\frac{T-4000}{14000-4000}\right)\right)\right.


$$


## Excalidraw

```excalidraw
{"type":"excalidraw/clipboard","elements":[{"type":"rectangle","version":14,"versionNonce":1361369853,"isDeleted":false,"id":"_PSpf6pLwkWIJubC_tf9D","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":545.0390625,"y":387.296875,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":177.53515625,"height":138.328125,"seed":1495751197,"groupIds":[],"frameId":null,"roundness":{"type":3},"boundElements":[],"updated":1706954302946,"link":null,"locked":false}],"files":{}}
```

````markdown
```excalidraw
{"type":"excalidraw/clipboard","elements":[{"type":"rectangle","version":14,"versionNonce":1361369853,"isDeleted":false,"id":"_PSpf6pLwkWIJubC_tf9D","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":545.0390625,"y":387.296875,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":177.53515625,"height":138.328125,"seed":1495751197,"groupIds":[],"frameId":null,"roundness":{"type":3},"boundElements":[],"updated":1706954302946,"link":null,"locked":false}],"files":{}}
```
````

## React Remote Component Render
<!-- 
```component
import=http://127.0.0.1:2333/snippets/js/components
name=MyComponents.Card
```

````markdown
```component
import=http://127.0.0.1:2333/snippets/js/components
name=MyComponents.Card
```
```` -->


```component
import=https://cdn.jsdelivr.net/npm/@innei/react-cdn-components@0.0.7/dist/components/Firework.js
name=MDX.Firework
height=25
```

````markdown
```component
import=https://cdn.jsdelivr.net/npm/@innei/react-cdn-components@0.0.7/dist/components/Firework.js
name=MDX.Firework
height=25
```
````

