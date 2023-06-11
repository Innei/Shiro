import type { Metadata } from 'next'

export const defineMetadata = <T extends Record<string, string>>(
  fn: (params: T) => Promise<Partial<Metadata>>,
) => {
  return async ({ params }: { params: T }): Promise<Metadata> => {
    const result = await fn(params)

    return {}
  }
}
