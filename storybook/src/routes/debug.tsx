import { createContextState } from 'foxact/create-context-state'

const [ContextProvider, useContextValue, useSetContextValue] =
  createContextState({})
const noop = {}

export default () => {
  return (
    <div>
      <ContextProvider>
        <Child />
        <Child2 />
      </ContextProvider>
    </div>
  )
}

const Child = () => {
  console.log('render Child')

  // useContextValue()
  return <div>Child</div>
}

const Child2 = () => {
  console.log('render Child2')
  const setter = useSetContextValue()
  return (
    <div>
      Child 2
      <button
        onClick={() => {
          setter({})
        }}
      >
        Set new value
      </button>
    </div>
  )
}
