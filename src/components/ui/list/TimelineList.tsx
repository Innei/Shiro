import clsx from 'clsx'

export const TimelineList: Component = ({ children, className }) => {
  return <ul className={clsx('shiro-timeline', className)}>{children}</ul>
}
