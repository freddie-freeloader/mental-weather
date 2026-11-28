import { useEffect, useRef, useState, type KeyboardEvent } from "react"

interface Props {
  labels: string[]
  current: number
  onSelect: (index: number) => void
}

const PRIMARY_COUNT = 4

function shortLabel(label: string, index: number): string {
  if (index === 0) return "Morning"
  if (index === 1) return "Evening"
  return label
}

function visibleTabs(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
    (button) => button.getClientRects().length > 0,
  )
}

export default function SectionNav({ labels, current, onSelect }: Props) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreToggleRef = useRef<HTMLButtonElement>(null)
  const arrowMove = useRef(false)

  const focusMoreToggle = () => {
    const toggle = moreToggleRef.current
    if (toggle && toggle.getClientRects().length > 0) toggle.focus()
  }

  const closeMore = (restoreFocus: boolean) => {
    if (restoreFocus) focusMoreToggle()
    setMoreOpen(false)
  }

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      closeMore(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [moreOpen])

  const choose = (index: number) => {
    const fromArrow = arrowMove.current
    arrowMove.current = false
    onSelect(index)
    if (fromArrow) return
    if (index >= PRIMARY_COUNT) {
      closeMore(true)
      return
    }
    setMoreOpen(false)
  }

  const onTabKey = (event: KeyboardEvent<HTMLElement>) => {
    const key = event.key
    const horizontal = key === "ArrowRight" || key === "ArrowLeft"
    const vertical = key === "ArrowDown" || key === "ArrowUp"
    if (!horizontal && !vertical && key !== "Home" && key !== "End") return
    const visible = visibleTabs(event.currentTarget)
    const active = document.activeElement
    if (!(active instanceof HTMLButtonElement)) return
    const index = visible.indexOf(active)
    if (index < 0 || visible.length === 0) return
    event.preventDefault()
    const nextIndex =
      key === "Home"
        ? 0
        : key === "End"
          ? visible.length - 1
          : key === "ArrowRight" || key === "ArrowDown"
            ? (index + 1) % visible.length
            : (index - 1 + visible.length) % visible.length
    const next = visible[nextIndex]
    if (!next) return
    arrowMove.current = true
    next.focus()
    next.click()
  }

  const tab = (index: number) => {
    const label = labels[index] ?? ""
    const selected = current === index
    return (
      <button
        key={index}
        type="button"
        role="tab"
        id={`tab-${index}`}
        aria-controls={`tabpanel-${index}`}
        aria-selected={selected}
        className={selected ? "nav-btn is-current" : "nav-btn"}
        onClick={() => choose(index)}
      >
        <span className="nav-full">{label}</span>
        <span className="nav-short" aria-hidden="true">
          {shortLabel(label, index)}
        </span>
      </button>
    )
  }

  return (
    <nav className="section-nav" role="tablist" aria-label="Check-ins" onKeyDown={onTabKey}>
      {labels.slice(0, PRIMARY_COUNT).map((_, index) => tab(index))}
      <div className="more-menu">
        <button
          ref={moreToggleRef}
          type="button"
          className={current >= PRIMARY_COUNT ? "nav-btn more-toggle is-current" : "nav-btn more-toggle"}
          aria-expanded={moreOpen}
          aria-controls="more-panel"
          onClick={() => setMoreOpen((open) => !open)}
        >
          More
        </button>
        <div id="more-panel" className={moreOpen ? "more-panel is-open" : "more-panel"}>
          {labels.slice(PRIMARY_COUNT).map((_, index) => tab(index + PRIMARY_COUNT))}
        </div>
      </div>
    </nav>
  )
}
