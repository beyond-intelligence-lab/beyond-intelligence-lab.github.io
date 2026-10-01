import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
// Poppins, latin subset only — CJK falls through to the system stack below it.
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-600.css'
import './styles/global.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container #root not found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
