import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppStateProvider, AuthProvider } from './state'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppStateProvider>
  </StrictMode>,
)
