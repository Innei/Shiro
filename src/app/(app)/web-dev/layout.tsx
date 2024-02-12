export const metadata = {
  title: 'dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <>{children}</>
    </>
  )
}
