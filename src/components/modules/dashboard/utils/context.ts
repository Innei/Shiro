import { createContext } from 'react'

import type { RouteItem } from '../../../../app/(dashboard)/dashboard/[[...catch_all]]/router'

export const DashboardLayoutContext = createContext<RouteItem[]>([])
