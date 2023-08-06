export const useRouter = () => {
  return {
    push(path) {
      location.pathname = path
    },
  }
}

export const usePathname = () => location.pathname
