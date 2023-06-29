import clsx from 'clsx'

import styles from './TimelineList.module.css'

export const TimelineList: Component = ({ children, className }) => {
  return <ul className={clsx(styles['timeline'], className)}>{children}</ul>
}
