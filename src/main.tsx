import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'beercss'
import 'material-dynamic-colors'
import './theme.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
