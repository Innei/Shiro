import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import './index.css'
import './markdown.css'
import '../../src/styles/index.css'

import { routes } from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={routes} />,
)
