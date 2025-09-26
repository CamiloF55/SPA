import { useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAnnouncement } from './useAnnouncement'

/**
 * Hook para manejar navegación por teclado de forma accesible
 * Implementa atajos de teclado estándar y navegación ARIA
 */
export const useKeyboardNavigation = (options = {}) => {
  const {
    enableGlobalShortcuts = true,
    enableArrowNavigation = false,
    enableEscapeHandling = true,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  } = options

  const navigate = useNavigate()
  const location = useLocation()
  const { announceNavigation, announce } = useAnnouncement()
  const keyboardModeRef = useRef(false)

  /**
   * Detectar si el usuario está navegando por teclado
   */
  const handleKeyboardDetection = useCallback((event) => {
    if (event.key === 'Tab') {
      keyboardModeRef.current = true
      document.body.classList.add('keyboard-navigation')
    }
  }, [])

  const handleMouseDetection = useCallback(() => {
    keyboardModeRef.current = false
    document.body.classList.remove('keyboard-navigation')
  }, [])

  /**
   * Manejar atajos de teclado globales
   */
  const handleGlobalKeyDown = useCallback((event) => {
    // Atajos Alt + Número para navegación rápida
    if (event.altKey && !event.ctrlKey && !event.shiftKey) {
      const keyNumber = parseInt(event.key)
      
      if (keyNumber >= 1 && keyNumber <= 4) {
        event.preventDefault()
        
        const routes = {
          1: { path: '/inicio', name: 'Página de Inicio' },
          2: { path: '/recursos', name: 'Recursos Educativos' },
          3: { path: '/contacto', name: 'Contacto' },
          4: { path: '/accesibilidad', name: 'Declaración de Accesibilidad' }
        }
        
        const targetRoute = routes[keyNumber]
        if (targetRoute && location.pathname !== targetRoute.path) {
          navigate(targetRoute.path)
          announceNavigation(targetRoute.name, targetRoute.path)
          console.log(`⌨️ Navegación por atajo: Alt+${keyNumber} -> ${targetRoute.name}`)
        }
        return
      }
    }

    // Ctrl + K para búsqueda (en página de recursos)
    if (event.ctrlKey && event.key === 'k' && location.pathname === '/recursos') {
      event.preventDefault()
      const searchInput = document.getElementById('search-resources')
      if (searchInput) {
        searchInput.focus()
        announce('Enfoque en campo de búsqueda', 'polite')
        console.log('⌨️ Ctrl+K: Enfoque en búsqueda')
      }
      return
    }

    // Ctrl + Home para ir al inicio
    if (event.ctrlKey && event.key === 'Home') {
      event.preventDefault()
      const skipLink = document.querySelector('.skip-link') || 
                     document.querySelector('main') ||
                     document.querySelector('h1')
      if (skipLink) {
        skipLink.focus()
        announce('Enfoque en inicio de página', 'polite')
      }
      return
    }

    // Escape para cerrar elementos abiertos
    if (enableEscapeHandling && event.key === 'Escape') {
      handleEscapeKey(event)
    }
  }, [navigate, location, announceNavigation, announce, enableEscapeHandling])

  /**
   * Manejar tecla Escape para cerrar elementos
   */
  const handleEscapeKey = useCallback((event) => {
    // Cerrar modales
    const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
    if (openModal) {
      const closeButton = openModal.querySelector('[data-close], .close, .modal-close')
      if (closeButton) {
        closeButton.click()
        event.preventDefault()
        announce('Modal cerrado', 'polite')
        return
      }
    }

    // Cerrar menús expandidos
    const expandedMenu = document.querySelector('[aria-expanded="true"]')
    if (expandedMenu) {
      expandedMenu.setAttribute('aria-expanded', 'false')
      expandedMenu.focus()
      event.preventDefault()
      announce('Menú cerrado', 'polite')
      return
    }

    // Cerrar elementos personalizados con data-escapable
    const escapableElement = document.querySelector('[data-escapable="true"]')
    if (escapableElement) {
      escapableElement.style.display = 'none'
      escapableElement.setAttribute('aria-hidden', 'true')
      event.preventDefault()
      announce('Elemento cerrado', 'polite')
    }
  }, [announce])

  /**
   * Navegación con flechas para listas y menús
   */
  const createArrowNavigation = useCallback((containerSelector, options = {}) => {
    const {
      itemSelector = '[role="menuitem"], [role="option"], button, [href]',
      orientation = 'vertical', // 'vertical', 'horizontal', 'both'
      loop = true,
      focusOnActivate = true
    } = options

    const handleArrowNavigation = (event) => {
      const container = document.querySelector(containerSelector)
      if (!container || !container.contains(event.target)) return

      const items = container.querySelectorAll(itemSelector)
      const currentIndex = Array.from(items).indexOf(document.activeElement)
      
      if (currentIndex === -1) return

      let nextIndex = currentIndex
      const isVertical = orientation === 'vertical' || orientation === 'both'
      const isHorizontal = orientation === 'horizontal' || orientation === 'both'

      switch (event.key) {
        case 'ArrowDown':
          if (isVertical) {
            event.preventDefault()
            nextIndex = loop && currentIndex === items.length - 1 ? 0 : Math.min(currentIndex + 1, items.length - 1)
          }
          break
        case 'ArrowUp':
          if (isVertical) {
            event.preventDefault()
            nextIndex = loop && currentIndex === 0 ? items.length - 1 : Math.max(currentIndex - 1, 0)
          }
          break
        case 'ArrowRight':
          if (isHorizontal) {
            event.preventDefault()
            nextIndex = loop && currentIndex === items.length - 1 ? 0 : Math.min(currentIndex + 1, items.length - 1)
          }
          break
        case 'ArrowLeft':
          if (isHorizontal) {
            event.preventDefault()
            nextIndex = loop && currentIndex === 0 ? items.length - 1 : Math.max(currentIndex - 1, 0)
          }
          break
        case 'Home':
          if (event.ctrlKey || container.contains(event.target)) {
            event.preventDefault()
            nextIndex = 0
          }
          break
        case 'End':
          if (event.ctrlKey || container.contains(event.target)) {
            event.preventDefault()
            nextIndex = items.length - 1
          }
          break
      }

      if (nextIndex !== currentIndex && items[nextIndex]) {
        if (focusOnActivate) {
          items[nextIndex].focus()
        }
        
        // Anunciar posición si hay más de 3 elementos
        if (items.length > 3) {
          announce(`Elemento ${nextIndex + 1} de ${items.length}`, 'polite')
        }
      }
    }

    document.addEventListener('keydown', handleArrowNavigation)
    
    return () => {
      document.removeEventListener('keydown', handleArrowNavigation)
    }
  }, [announce])

  /**
   * Configurar navegación por primera letra (typeahead)
   */
  const createTypeaheadNavigation = useCallback((containerSelector, itemSelector = '[role="menuitem"], [role="option"]') => {
    let searchString = ''
    let searchTimeout = null

    const handleTypeahead = (event) => {
      const container = document.querySelector(containerSelector)
      if (!container || !container.contains(event.target)) return

      // Solo procesar letras y números
      if (!/^[a-zA-Z0-9\u00C0-\u017F]$/.test(event.key)) return

      event.preventDefault()
      
      // Agregar carácter a la cadena de búsqueda
      searchString += event.key.toLowerCase()

      // Limpiar timeout anterior
      if (searchTimeout) clearTimeout(searchTimeout)

      // Buscar elemento que coincida
      const items = container.querySelectorAll(itemSelector)
      const matchingItem = Array.from(items).find(item => {
        const text = (item.textContent || item.getAttribute('aria-label') || '').toLowerCase()
        return text.startsWith(searchString)
      })

      if (matchingItem) {
        matchingItem.focus()
        announce(`Encontrado: ${matchingItem.textContent || matchingItem.getAttribute('aria-label')}`, 'polite')
      }

      // Limpiar cadena después de 1 segundo
      searchTimeout = setTimeout(() => {
        searchString = ''
      }, 1000)
    }

    document.addEventListener('keydown', handleTypeahead)
    
    return () => {
      document.removeEventListener('keydown', handleTypeahead)
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [announce])

  /**
   * Obtener información sobre el estado actual del teclado
   */
  const getKeyboardState = useCallback(() => {
    return {
      isKeyboardMode: keyboardModeRef.current,
      currentPath: location.pathname,
      focusedElement: document.activeElement,
      hasKeyboardTraps: document.querySelectorAll('[data-focus-trap="true"]').length > 0
    }
  }, [location])

  // Configurar event listeners
  useEffect(() => {
    // Detectar modo de navegación
    document.addEventListener('keydown', handleKeyboardDetection)
    document.addEventListener('mousedown', handleMouseDetection)
    document.addEventListener('touchstart', handleMouseDetection)

    // Atajos globales
    if (enableGlobalShortcuts) {
      document.addEventListener('keydown', handleGlobalKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboardDetection)
      document.removeEventListener('mousedown', handleMouseDetection)
      document.removeEventListener('touchstart', handleMouseDetection)
      
      if (enableGlobalShortcuts) {
        document.removeEventListener('keydown', handleGlobalKeyDown)
      }
    }
  }, [handleKeyboardDetection, handleMouseDetection, handleGlobalKeyDown, enableGlobalShortcuts])

  return {
    isKeyboardMode: keyboardModeRef.current,
    createArrowNavigation,
    createTypeaheadNavigation,
    getKeyboardState,
    handleEscapeKey
  }
}