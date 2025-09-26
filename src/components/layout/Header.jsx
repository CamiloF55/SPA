import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { useAnnouncement } from '../../hooks/useAnnouncement'

/**
 * Componente Header con navegación accesible
 * Incluye menú responsive y soporte completo para teclado
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { createArrowNavigation } = useKeyboardNavigation()
  const { announce } = useAnnouncement()

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Configurar navegación con flechas en el menú
  useEffect(() => {
    if (isMenuOpen) {
      const cleanup = createArrowNavigation('#main-nav', {
        itemSelector: 'a[role="menuitem"]',
        orientation: 'vertical',
        loop: true
      })
      return cleanup
    }
  }, [isMenuOpen, createArrowNavigation])

  // Cerrar menú con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        // Enfocar el botón de menú después de cerrar
        const menuButton = document.getElementById('menu-toggle')
        if (menuButton) {
          menuButton.focus()
        }
        announce('Menú cerrado', 'polite')
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen, announce])

  const toggleMenu = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)
    
    if (newState) {
      announce('Menú abierto. Use las flechas para navegar y Escape para cerrar.', 'polite')
      // Enfocar primer enlace del menú
      setTimeout(() => {
        const firstLink = document.querySelector('#main-nav a')
        if (firstLink) {
          firstLink.focus()
        }
      }, 100)
    } else {
      announce('Menú cerrado', 'polite')
    }
  }

  const handleLinkClick = (pageName) => {
    setIsMenuOpen(false)
    announce(`Navegando a ${pageName}`, 'polite')
  }

  const isCurrentPage = (path) => {
    return location.pathname === path
  }

  const navigationItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/recursos', label: 'Recursos', icon: '📚' },
    { path: '/contacto', label: 'Contacto', icon: '📧' },
    { path: '/accesibilidad', label: 'Accesibilidad', icon: '♿' }
  ]

  return (
    <header className="header" role="banner">
      <div className="header-content">
        {/* Logo/Título */}
        <div className="logo">
          <Link 
            to="/inicio" 
            className="logo-link"
            onClick={() => handleLinkClick('Página de Inicio')}
            aria-label="Portal de Recursos Educativos Accesibles - Ir al inicio"
          >
            <span className="logo-icon" aria-hidden="true">📚</span>
            <span className="logo-text">Portal Educativo Accesible</span>
          </Link>
        </div>

        {/* Botón de menú móvil */}
        <button
          id="menu-toggle"
          className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={toggleMenu}
          type="button"
        >
          <span className="menu-icon" aria-hidden="true">
            {isMenuOpen ? '✕' : '☰'}
          </span>
          <span className="menu-text">
            {isMenuOpen ? 'Cerrar' : 'Menú'}
          </span>
        </button>

        {/* Navegación principal */}
        <nav
          id="main-nav"
          className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}
          role="navigation"
          aria-label="Navegación principal"
          aria-hidden={!isMenuOpen ? 'false' : 'true'}
        >
          <ul className="nav-list" role="menubar">
            {navigationItems.map((item) => (
              <li key={item.path} className="nav-item" role="none">
                <Link
                  to={item.path}
                  className={`nav-link ${isCurrentPage(item.path) ? 'nav-link-current' : ''}`}
                  role="menuitem"
                  aria-current={isCurrentPage(item.path) ? 'page' : undefined}
                  onClick={() => handleLinkClick(item.label)}
                  onFocus={() => console.log(`🎯 Enlace enfocado: ${item.label}`)}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {isCurrentPage(item.path) && (
                    <span className="sr-only"> (página actual)</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Indicador de página actual para lectores de pantalla */}
        <div className="sr-only" aria-live="polite" id="current-page-indicator">
          {navigationItems.find(item => isCurrentPage(item.path))?.label && 
            `Página actual: ${navigationItems.find(item => isCurrentPage(item.path))?.label}`
          }
        </div>
      </div>
    </header>
  )
}

export default Header