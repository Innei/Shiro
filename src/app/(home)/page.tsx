'use client'

import { clsxm } from '~/lib/helper'

const Screen: Component = (props) => {
  return (
    <div className={clsxm('flex h-screen flex-col center', props.className)}>
      {props.children}
    </div>
  )
}
export default function Home() {
  return (
    <div>
      <Screen className="mt-[-4.5rem]">
        <h1>
          这个页面还没构思，待到春去秋来，我会在这里写下一些关于我自己的故事。
        </h1>
        <h1>其他页面基本已完成。你可以在顶部的导航栏中找到它们。</h1>
        <h1>欢迎给我反馈问题，谢谢您。</h1>
      </Screen>
      <Screen className="mt-[-4.5rem]">
        <h1>
          欢迎，来到这个小小的宇宙，一个闪烁着光彩的星球，等待着你的探索。
        </h1>
      </Screen>
      <Screen>
        <h1>
          在这个矩阵中，你可以找到各种各样的代码块，它们是我在计算机科学的探索和实践的证明。
        </h1>
      </Screen>
      <Screen>
        <h1>
          而在这里，你会看到一个不同的我，一个在生活中发现美，感受痛苦，洞察人性的我。
        </h1>
      </Screen>
      <Screen>
        <h1>
          这些是我珍视的人，他们陪伴我走过人生的每一段旅程，和我一起笑，一起哭，一起成长。
        </h1>
      </Screen>
      <Screen>
        <h1>
          最后，这是关于这个小宇宙以及我自己的一些小秘密。如果你有任何问题或者想要分享的想法，都可以随时找到我。
        </h1>
      </Screen>
    </div>
  )
}
