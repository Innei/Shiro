export const Container: Component = ({ children }) => {
  return (
    <div className="relative m-auto mt-[120px] min-h-[300px] w-full max-w-5xl px-2 md:px-6 lg:p-0">
      {children}
    </div>
  )
}
