import './index.css'
import './markdown.css'
import '../../src/styles/index.css'

import { LazyMotion } from 'motion/react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routes } from './router'

const load = () => import('motion/react').then((res) => res.domMax)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <LazyMotion features={load}>
    <RouterProvider router={routes} />
  </LazyMotion>,
)
