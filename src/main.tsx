import '@/assets/styles/index.css'
import { AuthProvider } from '@/core/context/AuthContext'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './i18n/config'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)