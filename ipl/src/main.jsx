import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init = {}) => {
    const initWithCredentials = { credentials: 'include', ...init }
    return originalFetch(input, initWithCredentials)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
