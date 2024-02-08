export const Container: Component = ({ children }) => {
  return (
    <div className="container m-auto mt-[120px] max-w-7xl px-2 md:px-6 lg:px-4 xl:px-0">
      {children}
    </div>
  )
}
