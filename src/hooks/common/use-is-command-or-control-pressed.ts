import { useEffect, useState } from 'react'

let globalIsPressed = false
let listeners = [] as ((isPressed: boolean) => void)[]

function notifyListeners() {
  listeners.forEach((listener) => listener(globalIsPressed))
}

function handleKeyDown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && !globalIsPressed) {
    globalIsPressed = true
    notifyListeners()
  }
}

function handleKeyUp() {
  if (globalIsPressed) {
    globalIsPressed = false
    notifyListeners()
  }
}

function addListener(listener: (isPressed: boolean) => void) {
  listeners.push(listener)
  listener(globalIsPressed)
}

function removeListener(listener: (isPressed: boolean) => void) {
  listeners = listeners.filter((l) => l !== listener)
}

export function useIsCommandOrControlPressed() {
  const [isPressed, setIsPressed] = useState(globalIsPressed)

  useEffect(() => {
    addListener(setIsPressed)

    if (listeners.length === 1) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }

    return () => {
      removeListener(setIsPressed)

      if (listeners.length === 0) {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [])

  return isPressed
}

export default useIsCommandOrControlPressed
