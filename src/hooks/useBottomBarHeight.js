import { useEffect, useRef } from 'react'

const DEFAULT_BOTTOM_BAR_HEIGHT = '152px'

export function useBottomBarHeight() {
  const barRef = useRef(null)

  useEffect(() => {
    const element = barRef.current
    if (!element) return undefined

    const root = document.documentElement

    const updateHeight = () => {
      const height = Math.ceil(element.getBoundingClientRect().height)
      root.style.setProperty('--mobile-bottom-bar-height', `${height}px`)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserver.observe(element)
    window.addEventListener('resize', updateHeight)
    window.visualViewport?.addEventListener('resize', updateHeight)
    window.visualViewport?.addEventListener('scroll', updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeight)
      window.visualViewport?.removeEventListener('resize', updateHeight)
      window.visualViewport?.removeEventListener('scroll', updateHeight)
      root.style.setProperty('--mobile-bottom-bar-height', DEFAULT_BOTTOM_BAR_HEIGHT)
    }
  }, [])

  return barRef
}
