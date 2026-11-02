import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initSecurity } from './security'

// Initialize security before rendering
initSecurity()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
