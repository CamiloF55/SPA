import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useFocusManagement } from '../../hooks/useFocusManagement'
import { useAnnouncement } from '../../hooks/useAnnouncement'

/**
 * Componente que maneja el foco de forma global en la aplicación
 * Se encarga de enfocar elementos apropiados en cambios de ruta
 */
const FocusManager = () => {
  const location = useLocation()
  const { focusElement } = useFocusManagement()
  const { announceNavigation } = useAnnouncement()

  // Manejar foco en cambios de ruta
  useEffect(() => {
    const handleRouteChange = () => {
      // Breve delay para permitir que React termine de renderizar
      setTimeout(() => {
        // Primero intentar enfocar el título principal (h1)
        const mainTitle = document.querySelector('main h1[tabindex="-1"]')
        if (mainTitle) {
          focusElement(mainTitle, {
            preventScroll: false,
            announce: false // El anuncio se hace por separado
          })
          
          // Anunciar el cambio de página
          const pageTitle = mainTitle.textContent
          if (pageTitle) {
            announceNavigation(pageTitle, location.pathname)
          }
          
          console.log('🎯 Foco movido al título principal:', pageTitle)
          return
        }

        // Si no hay h1, enfocar el contenido principal
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          focusElement(mainContent, {
            preventScroll: false,
            announce: true,
            announceText: 'Contenido principal cargado'
          })
          console.log('🎯 Foco movido al contenido principal')
          return
        }

        // Como último recurso, anunciar al menos que cambió la página
        announceNavigation('Nueva página cargada', location.pathname)
        console.log('⚠️ No se pudo enfocar ningún elemento específico')
      }, 100)
    }

    handleRouteChange()
  }, [location.pathname, focusElement, announceNavigation])

  // Manejar foco en elementos que se muestran/ocultan dinámicamente
  useEffect(() => {
    const handleDynamicContent = () => {
      // Observer para detectar cuando aparecen nuevos elementos focusables
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Si es un modal o diálogo
              if (node.matches && (node.matches('[role="dialog"]') || node.classList.contains('modal'))) {
                setTimeout(() => {
                  focusElement(node.querySelector('h1, h2, [autofocus], button'), {
                    delay: 50,
                    announce: true,
                    announceText: 'Diálogo abierto'
                  })
                }, 100)
              }
              
              // Si es contenido con aria-live
              if (node.matches && node.matches('[aria-live]')) {
                const focusableElement = node.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                if (focusableElement) {
                  setTimeout(() => {
                    focusElement(focusableElement, { delay: 200 })
                  }, 300)
                }
              }
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      return () => observer.disconnect()
    }

    const cleanup = handleDynamicContent()
    return cleanup
  }, [focusElement])

  // Este componente no renderiza nada visible
  return null
}

export default FocusManager