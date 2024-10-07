import { useQuery } from '@tanstack/react-query'

import PKG from '~/../package.json'
import { apiClient } from '~/lib/request'

export const Version = () => {
  const { data: version, isLoading } = useQuery({
    queryKey: ['version'],
    queryFn: () => apiClient.proxy.info.get<AppInfo>(),
    refetchInterval: 1000 * 60 * 60 * 24,
  })
  if (isLoading)
    return (
      <div className="flex justify-center">
        <div className="loading loading-dots" />
      </div>
    )

  return (
    <div className="opacity-60">
      <p className="text-center">
        <div className="inline-flex items-center">
          Shiro 版本：{PKG.version}
        </div>
        <br />
        Mix Space Core 版本：{version?.version || 'N/A'}
        <br />
      </p>
    </div>
  )
}

interface AppInfo {
  name: string
  version: string
}
