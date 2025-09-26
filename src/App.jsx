import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SkipLinks from './components/accessibility/SkipLinks'
import AnnouncementRegion from './components/accessibility/AnnouncementRegion'
import FocusManager from './components/accessibility/FocusManager'

// Pages
import HomePage from './pages/HomePage'
import ResourcesPage from './pages/ResourcesPage'
import ContactPage from './pages/ContactPage'
import AccessibilityPage from './pages/AccessibilityPage'

// Hooks
import { useAccessibility } from './hooks/useAccessibility'
import { useAnnouncement } from './hooks/useAnnouncement'

// Styles
import './styles/App.css'

function App() {
  const { 
    fontSize, 
    contrastMode, 
    reducedMotion,
    loadAccessibilityPreferences,
    applyAccessibilityClasses 
  } = useAccessibility()
  
  const { announce } = useAnnouncement()

  useEffect(() => {
    // Cargar preferencias guardadas
    loadAccessibilityPreferences()
    
    // Aplicar clases de accesibilidad al body
    applyAccessibilityClasses()
    
    // Anunciar que la aplicación está lista
    const timer = setTimeout(() => {
      announce(
        'Portal de Recursos Educativos Accesibles cargado. Use Alt + 1-4 para navegación rápida.',
        'polite'
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [loadAccessibilityPreferences, applyAccessibilityClasses, announce])

  // Aplicar clases cuando cambien las preferencias
  useEffect(() => {
    applyAccessibilityClasses()
  }, [fontSize, contrastMode, reducedMotion, applyAccessibilityClasses])

  // Configurar atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + 1-4 para navegación rápida
      if (event.altKey && !event.ctrlKey && !event.shiftKey) {
        const keyNumber = parseInt(event.key)
        if (keyNumber >= 1 && keyNumber <= 4) {
          event.preventDefault()
          
          const routes = ['/inicio', '/recursos', '/contacto', '/accesibilidad']
          const targetRoute = routes[keyNumber - 1]
          
          if (targetRoute) {
            window.location.hash = targetRoute.substring(1)
            announce(`Navegando a ${getPageTitle(targetRoute)}`, 'polite')
          }
        }
      }

      // Escape para cerrar elementos modales
      if (event.key === 'Escape') {
        // Cerrar menús abiertos, modales, etc.
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
        const openMenu = document.querySelector('[aria-expanded="true"]')
        
        if (activeModal) {
          // Lógica para cerrar modal
          event.preventDefault()
        } else if (openMenu) {
          // Lógica para cerrar menú
          event.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [announce])

  const getPageTitle = (route) => {
    const titles = {
      '/inicio': 'Página de Inicio',
      '/recursos': 'Recursos Educativos',
      '/contacto': 'Contacto',
      '/accesibilidad': 'Declaración de Accesibilidad'
    }
    return titles[route] || 'Página'
  }

  return (
    <div className={`app ${fontSize} ${contrastMode} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Helmet>
        <html lang="es" />
        <title>Portal de Recursos Educativos Accesibles</title>
        <meta 
          name="description" 
          content="Plataforma educativa inclusiva desarrollada con React, cumpliendo estándares WCAG 2.1 AA para garantizar acceso universal a recursos educativos de calidad." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://portal-educativo-accesible.edu" />
      </Helmet>

      {/* Skip Links - Siempre primero */}
      <SkipLinks />
      
      {/* Region de anuncios para lectores de pantalla */}
      <AnnouncementRegion />
      
      {/* Focus Manager para navegación accesible */}
      <FocusManager />

      {/* Header con navegación */}
      <Header />

      {/* Contenido principal */}
      <main 
        id="main-content" 
        className="main-content" 
        role="main"
        tabIndex={-1}
      >
        <Routes>
          <Route 
            path="/" 
            element={<Navigate to="/inicio" replace />} 
          />
          <Route 
            path="/inicio" 
            element={
              <HomePage 
                fontSize={fontSize}
                contrastMode={contrastMode}
              />
            } 
          />
          <Route 
            path="/recursos" 
            element={<ResourcesPage />} 
          />
          <Route 
            path="/contacto" 
            element={<ContactPage />} 
          />
          <Route 
            path="/accesibilidad" 
            element={<AccessibilityPage />} 
          />
          <Route 
            path="*" 
            element={
              <div className="error-page" role="alert">
                <div className="error-content">
                  <h1>🔍 Página no encontrada</h1>
                  <p>La página que buscas no existe o ha sido movida.</p>
                  <div className="error-actions">
                    <a 
                      href="/inicio" 
                      className="btn btn-primary"
                      onClick={() => announce('Regresando a la página de inicio', 'polite')}
                    >
                      🏠 Ir al Inicio
                    </a>
                    <a 
                      href="/recursos" 
                      className="btn btn-secondary"
                    >
                      📚 Ver Recursos
                    </a>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Debug info en desarrollo */}
      {import.meta.env.DEV && (
        <div 
          className="debug-info"
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            zIndex: 9999,
            fontFamily: 'monospace'
          }}
        >
          <div>🔤 Font: {fontSize}</div>
          <div>🎨 Contrast: {contrastMode}</div>
          <div>🎭 Motion: {reducedMotion ? 'reduced' : 'normal'}</div>
        </div>
      )}
    </div>
  )
}

export default App