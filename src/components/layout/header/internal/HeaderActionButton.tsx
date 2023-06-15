export const HeaderActionButton: Component = ({ children }) => {
  return (
    <button
      type="button"
      className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
    >
      {children}
    </button>
  )
}
