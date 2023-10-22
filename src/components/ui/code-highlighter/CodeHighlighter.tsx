import React, { useCallback, useEffect, useRef } from 'react'
import { shiki } from 'shiki'

import { toast } from '~/lib/toast' // 请根据项目结构调整导入路径

interface Props {
  lang: string | undefined
  content: string
}

shiki.setCDN('https://npm.onmicrosoft.cn/shiki/') // 设置 Shiki CDN 地址

const CodeHighlighter = (props: Props) => {
  const { lang: language, content: value } = props

  // 处理复制到剪贴板的函数
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    toast.success('COPIED！已复制！')
  }, [value])

  // 创建一个 ref 用于将高亮后的代码插入到 DOM 中
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const theme = 'dark_plus'

    // 在 Shiki 加载完成后执行高亮代码的操作
    shiki.onLoad(async () => {
      const shikiTheme = await shiki.getTheme(theme) // 获取 Shiki 主题

      // 设置代码高亮主题
      shiki.setTheme(shikiTheme)

      // 创建 Shiki 高亮器对象
      const highlighter = await shiki.getHighlighter({
        theme: shikiTheme,
        langs: language, // 选择需要支持的编程语言
      })

      // 使用 Shiki 高亮器将代码转换为 HTML
      const highlightedCode = highlighter.codeToHtml(value, language)

      return (
        <pre>
          <code
            className={`language-${language ?? 'markup'}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      )
    })
  }, [language, value])
}

export default CodeHighlighter
