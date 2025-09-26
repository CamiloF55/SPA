import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { AccessibilityProvider } from './contexts/AccessibilityContext.jsx'
import { AnnouncementProvider } from './contexts/AnnouncementContext.jsx'
import './styles/global.css'
import './styles/index.css'

// Configuración de desarrollo para accesibilidad
if (import.meta.env.DEV) {
  // Importar axe-core solo en desarrollo
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000)
    console.log('🔧 axe-core configurado para debugging de accesibilidad')
  }).catch(err => {
    console.warn('⚠️ No se pudo cargar axe-core:', err.message)
  })

  // Logger de accesibilidad personalizado
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args[0]
    if (typeof message === 'string' && message.includes('Warning:')) {
      if (message.includes('ARIA') || 
          message.includes('accessibility') || 
          message.includes('a11y') ||
          message.includes('tabIndex') ||
          message.includes('role')) {
        console.group('♿ Advertencia de Accesibilidad')
        originalConsoleError(...args)
        console.groupEnd()
        return
      }
    }
    originalConsoleError(...args)
  }
}

// Función para ocultar pantalla de carga
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    // Anunciar que la aplicación está lista
    loadingScreen.setAttribute('aria-live', 'polite')
    loadingScreen.querySelector('p').textContent = 'Aplicación cargada correctamente'
    
    setTimeout(() => {
      loadingScreen.style.opacity = '0'
      loadingScreen.style.transition = 'opacity 0.3s ease'
      
      setTimeout(() => {
        loadingScreen.remove()
        
        // Enfocar el primer elemento interactivo o el skip link
        const skipLink = document.querySelector('.skip-link')
        const firstFocusable = document.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        
        if (skipLink) {
          // Breve delay para permitir que React termine de renderizar
          setTimeout(() => {
            skipLink.focus()
          }, 100)
        } else if (firstFocusable) {
          setTimeout(() => {
            firstFocusable.focus()
          }, 100)
        }
      }, 300)
    }, 500)
  }
}

// Error Boundary Component
class AccessibilityErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 Error capturado por Error Boundary:', error, errorInfo)
    
    // Reportar error a servicio de analytics si está disponible
    if (typeof gtag !== 'undefined') {
      gtag('event', 'javascript_error', {
        event_category: 'error',
        event_label: error.message,
        value: 1
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          style={{
            padding: '2rem',
            margin: '2rem',
            background: '#fed7d7',
            border: '2px solid #e53e3e',
            borderRadius: '12px',
            textAlign: 'center',
            fontFamily: 'system-ui'
          }}
        >
          <h1 style={{ color: '#742a2a', marginBottom: '1rem' }}>
            ⚠️ Error en la Aplicación
          </h1>
          <p style={{ color: '#742a2a', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Ha ocurrido un error inesperado. La aplicación se está recuperando.
          </p>
          
          {import.meta.env.DEV && (
            <details style={{ 
              textAlign: 'left', 
              background: 'white', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles del Error (Desarrollo)
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                fontSize: '0.9rem', 
                marginTop: '1rem',
                color: '#e53e3e'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #ffd700'
                e.target.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none'
              }}
            >
              🔄 Recargar Aplicación
            </button>
            
            <a
              href="mailto:accesibilidad@portaleducativo.edu?subject=Error en Portal Educativo"
              style={{
                background: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block'
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #ffd700'
                e.target.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none'
              }}
            >
              📧 Reportar Error
            </a>
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Métodos de Contacto</h2>
            <p><strong>Email:</strong> accesibilidad@portaleducativo.edu</p>
            <p><strong>Teléfono:</strong> +1 (555) 123-4567</p>
            <p><strong>Horario:</strong> Lunes a viernes, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <AccessibilityErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AccessibilityProvider>
            <AnnouncementProvider>
              <App />
            </AnnouncementProvider>
          </AccessibilityProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AccessibilityErrorBoundary>
  </React.StrictMode>
)

// Configurar eventos de carga
window.addEventListener('load', () => {
  hideLoadingScreen()
  console.log('🎉 Portal Educativo Accesible cargado completamente')
})

// Detectar tecnologías de asistencia
if (navigator.userAgent.includes('NVDA') || 
    navigator.userAgent.includes('JAWS') || 
    window.speechSynthesis) {
  console.log('♿ Tecnología de asistencia detectada - optimizaciones activadas')
  document.documentElement.classList.add('assistive-tech-detected')
}

// Performance monitoring
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach(entry => {
      if (entry.duration > 100) {
        console.warn(`⚡ Componente lento: ${entry.name} - ${entry.duration}ms`)
      }
    })
  })
  
  try {
    observer.observe({ entryTypes: ['measure', 'navigation'] })
  } catch (e) {
    console.log('📊 Performance Observer no soportado')
  }
}