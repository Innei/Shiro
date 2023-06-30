export const NotSupport: Component<{
  text?: string
}> = ({ text }) => {
  return (
    <div className="flex h-[100px] items-center justify-center text-lg font-medium">
      {text || '您当前所在地区暂不支持此功能'}
    </div>
  )
}
