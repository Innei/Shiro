import { use } from 'react'
import { getInitialData } from '~/services/root'
export async function BasicLayout(props: { children: React.ReactNode }) {
  const initialData = await getInitialData()

  return (
    <>
      {initialData.data.title}

      {props.children}
    </>
  )
}
