export const useRouter = () => {
  return {
    push(path) {
      location.pathname = path
    },
  }
}
