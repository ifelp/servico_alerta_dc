import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ZoneProvider } from './contexts/zoneContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZoneProvider>
      <App />
    </ZoneProvider>
  </StrictMode>,
)
