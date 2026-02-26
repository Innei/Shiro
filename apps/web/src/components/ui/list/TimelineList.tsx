import clsx from 'clsx'

export const TimelineList: Component = ({ children, className }) => (
  <ul className={clsx('shiro-timeline', className)}>{children}</ul>
)
