import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'; // Importa AuthProvider
import { FormularioProvider } from './context/FormularioContext.jsx'; // 1. Importa el nuevo Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* 2. Envuelve la App con el FormularioProvider para que esté disponible en todas las rutas */}
      <FormularioProvider>
        <App />
      </FormularioProvider>
    </AuthProvider>
  </StrictMode>,
)
