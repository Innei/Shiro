export const Container: Component = ({ children }) => {
  return (
    <div className="container m-auto mt-12 max-w-7xl px-2 md:p-0">
      {children}
    </div>
  )
}
