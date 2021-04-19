import { useRef, useEffect, RefObject } from 'react'

export function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: (event: Event) => void,
  element?: RefObject<T>
) {
  const savedHandler = useRef<(event: Event) => void>()

  useEffect(() => {
    const targetElement: T | Window = element?.current || window
    if (!(targetElement && targetElement.addEventListener)) return

    if (savedHandler.current !== handler) savedHandler.current = handler

    const eventListener = (event: Event) => {
      if (!!savedHandler?.current) {
        savedHandler.current(event)
      }
    }
    targetElement.addEventListener(eventName, eventListener)
    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, handler])
}

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
