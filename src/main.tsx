import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { initSecurity } from "./security"
import { applyInkMode, readInkMode } from "./branding"
import "@fontsource/fraunces/500.css"
import "@fontsource/fraunces/latin-500-italic.css"
import "@fontsource/fraunces/600.css"
import "@fontsource/outfit/400.css"
import "@fontsource/outfit/500.css"
import "@fontsource/outfit/600.css"
import "./index.css"

applyInkMode(readInkMode())
initSecurity()

const root = document.getElementById("root")
if (!root) throw new Error("Root element missing")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
