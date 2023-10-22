// 导入React和一些React钩子和函数

// 导入一个自定义钩子，用于检查当前模式是否为打印模式
// 导入一个自定义钩子，用于检查当前主题是否为深色
// 导入自定义函数，用于加载脚本和样式表
// 导入一个自定义弹出通知工具

// 导入此组件的CSS模块样式

import {
  createShikiHighlighter,
  renderCodeToHTML,
  runTwoSlash,
} from 'shiki-twoslash'
import type { FC } from 'react' // 从React中导入FC类型，用于函数式组件

// 声明一个全局接口，用于在'window'对象上定义'Prism'属性
declare global {
  interface Window {
    Prism: any
  }
}

// 定义组件的属性接口
interface Props {
  lang: string // 代码片段的语言（或未定义）
  content: string // 要显示的代码内容
}

// 定义接受'Props'的函数式组件'HighLighter'
export const HighLighter: FC<Props> = (props) => {
  const { lang: language, content: value } = props // 从'props'中解构'lang'和'content'

  // // 定义一个用于将代码复制到剪贴板的回调函数
  // const handleCopy = useCallback(() => {
  //   navigator.clipboard.writeText(value); // 使用Clipboard API将代码复制到剪贴板
  //   toast.success('已复制！'); // 使用'toast'工具显示成功消息
  // }, [value]);

  // // 检查当前模式是否为打印模式
  // const isPrintMode = useIsPrintMode();

  // // 检查当前主题是否为深色
  // const isDark = useIsDark();
  // useInsertionEffect(() => {
  //   const css = loadStyleSheet(
  //     `https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism-themes/1.9.0/prism-one-${
  //       isPrintMode ? 'light' : isDark ? 'dark' : 'light'
  //     }.css`,
  //   );
  const go = async () => {
    const highlighter = await createShikiHighlighter({ theme: 'dark-plus' })
    const twoslash = runTwoSlash(value, language, {})
    const html = renderCodeToHTML(
      twoslash.code,
      language,
      { twoslash: true },
      { themeName: 'dark-plus' },
      highlighter,
      twoslash,
    )
    return html
  }

  return go()
}
