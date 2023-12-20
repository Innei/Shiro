export const useRouter = () => {
  return {
    push(path) {
      location.pathname = path
    },
  }
}

export const usePathname = () => location.pathname

export const useSearchParams = () => {
  const params = new URLSearchParams(location.search)
  return {
    get(key) {
      return params.get(key)
    },
  }
}
export const notFound = () => {}
export const nav = () => {}
export const redirect = () => {}
