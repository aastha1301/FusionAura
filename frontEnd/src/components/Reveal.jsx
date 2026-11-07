import { useEffect, useRef, useState } from "react"

const revealCallbacks = new WeakMap()
let revealObserver

function getRevealObserver() {
  if (revealObserver || !("IntersectionObserver" in window)) return revealObserver

  // Tall menu sections may never reach a large visible-area ratio at once.
  // Reveal as soon as any part of a section enters the viewport.
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      revealCallbacks.get(entry.target)?.()
      revealObserver.unobserve(entry.target)
    })
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" })

  return revealObserver
}

function Reveal({ as: Element = "div", children, className = "", delay = 0, style, ...props }) {
  const elementRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = elementRef.current
    if (!node) return undefined

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true)
      return undefined
    }

    const observer = getRevealObserver()
    if (!observer) {
      setVisible(true)
      return undefined
    }

    revealCallbacks.set(node, () => setVisible(true))
    observer.observe(node)
    return () => {
      observer.unobserve(node)
      revealCallbacks.delete(node)
    }
  }, [])

  return <Element
    ref={elementRef}
    data-reveal=""
    className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
    style={{ ...style, "--reveal-delay": `${delay}ms` }}
    {...props}
  >{children}</Element>
}

export default Reveal
