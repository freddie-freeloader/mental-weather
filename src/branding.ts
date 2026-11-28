export const THEME_KEY = "ophelia-pansies-theme"
export const WELCOME_KEY = "ophelia-pansies-seen-welcome"

export type InkMode = "light" | "dark"

export function readInkMode(): InkMode {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {
    return "dark"
  }
  return "dark"
}

export function applyInkMode(mode: InkMode): void {
  document.documentElement.dataset.theme = mode
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", mode === "dark" ? "#141c18" : "#f6f1e6")
}
