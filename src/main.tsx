import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'beercss'
import 'material-dynamic-colors'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
