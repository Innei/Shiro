import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'

export { Outlet as Component } from 'react-router-dom'

export const config = defineRouteConfig({
  title: 'Passkey',
  icon: <i className="i-mingcute-key-1-line" />,
  priority: 9,
  redirect: '/passkey',
})
