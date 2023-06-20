import { Outlet, ScrollRestoration } from 'react-router-dom'

import { Sidebar } from '../components/Sidebar'

export const Root = () => {
  return (
    <div>
      <Sidebar />
      <main className="markdown-body relative ml-[250px] p-4">
        <Outlet />
        <ScrollRestoration />
      </main>
    </div>
  )
}
