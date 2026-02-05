import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      console.log('[MSW] Loading mock service worker...')
      const { worker } = await import('./mocks/browser')
      console.log('[MSW] Starting worker...')
      await worker.start({ onUnhandledRequest: 'bypass' })
      console.log('[MSW] Worker started successfully')
    } catch (error) {
      console.error('[MSW] Failed to start:', error)
    }
  }
}

enableMocking().then(() => {
  console.log('[App] Rendering application...')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch((error) => {
  console.error('[App] Failed to render:', error)
})
