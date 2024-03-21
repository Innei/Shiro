import { Outlet, ScrollRestoration } from 'react-router-dom'

import { Sidebar } from '../components/Sidebar'

export const Root = () => {
  return (
    <div>
      <Sidebar />
      <main className="relative ml-[250px] max-h-screen overflow-auto p-4">
        <Outlet />
        <ScrollRestoration />
      </main>
    </div>
  )
}
