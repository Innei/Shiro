export type DashboardRouteConfig = {
  title: string
  icon: React.ReactNode
  priority: number
  redirect?: string
}
export const defineRouteConfig = (config: DashboardRouteConfig) => {
  return config
}
