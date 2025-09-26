import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

// Estados iniciales de accesibilidad
const initialState = {
  fontSize: 'font-normal', // font-normal, font-large, font-extra-large
  contrastMode: 'contrast-normal', // contrast-normal, contrast-high
  reducedMotion: false, // detectado del sistema
  screenReaderMode: false, // detectado automáticamente
  keyboardNavigation: false, // se activa al usar Tab
  focusVisible: true,
  announcements: [],
  preferences: {
    fontSize: 'normal',
    contrastMode: 'normal',
    reducedMotion: null, // null = usar preferencia del sistema
  }
}

// Action types
const ACCESSIBILITY_ACTIONS = {
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_CONTRAST_MODE: 'SET_CONTRAST_MODE',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  TOGGLE_SCREEN_READER_MODE: 'TOGGLE_SCREEN_READER_MODE',
  SET_KEYBOARD_NAVIGATION: 'SET_KEYBOARD_NAVIGATION',
  SET_FOCUS_VISIBLE: 'SET_FOCUS_VISIBLE',
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
  RESET_PREFERENCES: 'RESET_PREFERENCES',
  ADD_ANNOUNCEMENT: 'ADD_ANNOUNCEMENT',
  CLEAR_ANNOUNCEMENTS: 'CLEAR_ANNOUNCEMENTS'
}

// Reducer para manejar el estado de accesibilidad
const accessibilityReducer = (state, action) => {
  switch (action.type) {
    case ACCESSIBILITY_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: `font-${action.payload}`,
        preferences: {
          ...state.preferences,
          fontSize: action.payload
        }
      }

    case ACCESSIBILITY_ACTIONS.SET_CONTRAST_MODE:
      return {
        ...state,
        contrastMode: `contrast-${action.payload}`,
        preferences: {
          ...state.preferences,
          contrastMode: action.payload
        }
      }

    case ACCESSIBILITY_ACTIONS.SET_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: action.payload,
        preferences: {
          ...state.preferences,
          reducedMotion: action.payload
        }
      }

    case ACCESSIBILITY_ACTIONS.TOGGLE_SCREEN_READER_MODE:
      return {
        ...state,
        screenReaderMode: !state.screenReaderMode
      }

    case ACCESSIBILITY_ACTIONS.SET_KEYBOARD_NAVIGATION:
      return {
        ...state,
        keyboardNavigation: action.payload
      }

    case ACCESSIBILITY_ACTIONS.SET_FOCUS_VISIBLE:
      return {
        ...state,
        focusVisible: action.payload
      }

    case ACCESSIBILITY_ACTIONS.LOAD_PREFERENCES:
      return {
        ...state,
        ...action.payload
      }

    case ACCESSIBILITY_ACTIONS.RESET_PREFERENCES:
      return {
        ...initialState,
        reducedMotion: state.reducedMotion, // mantener detección del sistema
        screenReaderMode: state.screenReaderMode
      }

    case ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [...state.announcements, {
          id: Date.now(),
          message: action.payload.message,
          priority: action.payload.priority || 'polite',
          timestamp: Date.now()
        }]
      }

    case ACCESSIBILITY_ACTIONS.CLEAR_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: []
      }

    default:
      return state
  }
}

// Context
const AccessibilityContext = createContext()

// Provider Component
export const AccessibilityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState)

  // Detectar preferencias del sistema
  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    dispatch({
      type: ACCESSIBILITY_ACTIONS.SET_REDUCED_MOTION,
      payload: prefersReducedMotion.matches
    })

    // Escuchar cambios en preferencias del sistema
    const handleReducedMotionChange = (e) => {
      if (state.preferences.reducedMotion === null) {
        dispatch({
          type: ACCESSIBILITY_ACTIONS.SET_REDUCED_MOTION,
          payload: e.matches
        })
      }
    }

    prefersReducedMotion.addEventListener('change', handleReducedMotionChange)

    // Detectar tecnologías de asistencia
    const detectScreenReader = () => {
      const hasScreenReader = 
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis ||
        document.querySelector('[aria-live]')

      if (hasScreenReader) {
        dispatch({
          type: ACCESSIBILITY_ACTIONS.TOGGLE_SCREEN_READER_MODE,
          payload: true
        })
        console.log('♿ Tecnología de asistencia detectada')
      }
    }

    detectScreenReader()

    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange)
    }
  }, [state.preferences.reducedMotion])

  // Detectar navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        dispatch({
          type: ACCESSIBILITY_ACTIONS.SET_KEYBOARD_NAVIGATION,
          payload: true
        })
      }
    }

    const handleMouseDown = () => {
      dispatch({
        type: ACCESSIBILITY_ACTIONS.SET_KEYBOARD_NAVIGATION,
        payload: false
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Funciones de utilidad
  const setFontSize = useCallback((size) => {
    console.log(`🔤 Cambiando tamaño de fuente a: ${size}`)
    
    // Aplicar la clase directamente al body
    const body = document.body;
    body.className = body.className
      .replace(/font-(normal|large|extra-large)/g, '')
      .trim();
    body.classList.add(`font-${size}`);
    
    // Actualizar el estado
    dispatch({
      type: ACCESSIBILITY_ACTIONS.SET_FONT_SIZE,
      payload: size
    })
    
    // Guardar en localStorage
    localStorage.setItem('accessibility_fontSize', size)
    
    // Anunciar cambio
    dispatch({
      type: ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT,
      payload: {
        message: `Tamaño de fuente cambiado a ${getFontSizeLabel(size)}`,
        priority: 'polite'
      }
    })
  }, [])

  const setContrastMode = useCallback((mode) => {
    console.log(`🎨 Cambiando modo de contraste a: ${mode}`)
    dispatch({
      type: ACCESSIBILITY_ACTIONS.SET_CONTRAST_MODE,
      payload: mode
    })
    
    // Guardar en localStorage
    localStorage.setItem('accessibility_contrastMode', mode)
    
    // Anunciar cambio
    dispatch({
      type: ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT,
      payload: {
        message: `Modo de contraste cambiado a ${mode === 'high' ? 'alto contraste' : 'normal'}`,
        priority: 'polite'
      }
    })
  }, [])

  const toggleReducedMotion = useCallback(() => {
    const newValue = !state.reducedMotion
    dispatch({
      type: ACCESSIBILITY_ACTIONS.SET_REDUCED_MOTION,
      payload: newValue
    })
    
    localStorage.setItem('accessibility_reducedMotion', newValue.toString())
    
    dispatch({
      type: ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT,
      payload: {
        message: `Animaciones ${newValue ? 'desactivadas' : 'activadas'}`,
        priority: 'polite'
      }
    })
  }, [state.reducedMotion])

  const loadAccessibilityPreferences = useCallback(() => {
    try {
      const savedFontSize = localStorage.getItem('accessibility_fontSize')
      const savedContrastMode = localStorage.getItem('accessibility_contrastMode')
      const savedReducedMotion = localStorage.getItem('accessibility_reducedMotion')

      const preferences = {}

      if (savedFontSize && ['normal', 'large', 'extra-large'].includes(savedFontSize)) {
        preferences.fontSize = `font-${savedFontSize}`
        preferences.preferences = {
          ...preferences.preferences,
          fontSize: savedFontSize
        }
      }

      if (savedContrastMode && ['normal', 'high'].includes(savedContrastMode)) {
        preferences.contrastMode = `contrast-${savedContrastMode}`
        preferences.preferences = {
          ...preferences.preferences,
          contrastMode: savedContrastMode
        }
      }

      if (savedReducedMotion !== null) {
        const reducedMotion = savedReducedMotion === 'true'
        preferences.reducedMotion = reducedMotion
        preferences.preferences = {
          ...preferences.preferences,
          reducedMotion: reducedMotion
        }
      }

      if (Object.keys(preferences).length > 0) {
        dispatch({
          type: ACCESSIBILITY_ACTIONS.LOAD_PREFERENCES,
          payload: preferences
        })
        console.log('💾 Preferencias de accesibilidad cargadas:', preferences)
      }
    } catch (error) {
      console.error('❌ Error cargando preferencias de accesibilidad:', error)
    }
  }, [])

  const resetPreferences = useCallback(() => {
    dispatch({ type: ACCESSIBILITY_ACTIONS.RESET_PREFERENCES })
    
    // Limpiar localStorage
    localStorage.removeItem('accessibility_fontSize')
    localStorage.removeItem('accessibility_contrastMode')
    localStorage.removeItem('accessibility_reducedMotion')
    
    console.log('🔄 Preferencias de accesibilidad restablecidas')
    
    dispatch({
      type: ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT,
      payload: {
        message: 'Preferencias de accesibilidad restablecidas a valores por defecto',
        priority: 'polite'
      }
    })
  }, [])

  const applyAccessibilityClasses = useCallback(() => {
    const body = document.body
    const html = document.documentElement
    
    // Limpiar clases existentes
    body.className = body.className
      .replace(/font-(normal|large|extra-large)/g, '')
      .replace(/contrast-(normal|high)/g, '')
      .replace(/reduced-motion/g, '')
      .replace(/keyboard-navigation/g, '')
      .replace(/screen-reader-mode/g, '')
      .trim()

    // Aplicar nuevas clases
    if (state.fontSize) {
      body.classList.add(state.fontSize)
    }
    
    if (state.contrastMode && state.contrastMode !== 'contrast-normal') {
      body.classList.add(state.contrastMode)
    }
    
    if (state.reducedMotion) {
      body.classList.add('reduced-motion')
      html.style.setProperty('--animation-duration', '0.01ms')
      html.style.setProperty('--transition-duration', '0.01ms')
    } else {
      html.style.removeProperty('--animation-duration')
      html.style.removeProperty('--transition-duration')
    }
    
    if (state.keyboardNavigation) {
      body.classList.add('keyboard-navigation')
    }
    
    if (state.screenReaderMode) {
      body.classList.add('screen-reader-mode')
    }

    console.log('🎨 Clases de accesibilidad aplicadas:', body.className)
  }, [state.fontSize, state.contrastMode, state.reducedMotion, state.keyboardNavigation, state.screenReaderMode])

  const announce = useCallback((message, priority = 'polite') => {
    dispatch({
      type: ACCESSIBILITY_ACTIONS.ADD_ANNOUNCEMENT,
      payload: { message, priority }
    })
    
    console.log(`📢 Anuncio (${priority}): ${message}`)
  }, [])

  const clearAnnouncements = useCallback(() => {
    dispatch({ type: ACCESSIBILITY_ACTIONS.CLEAR_ANNOUNCEMENTS })
  }, [])

  // Funciones de utilidad
  const getFontSizeLabel = (size) => {
    const labels = {
      'normal': 'normal (16px)',
      'large': 'grande (18px)',
      'extra-large': 'extra grande (20px)'
    }
    return labels[size] || size
  }

  const getContrastLabel = (mode) => {
    return mode === 'high' ? 'Alto contraste' : 'Contraste normal'
  }

  const isHighContrast = () => {
    return state.contrastMode === 'contrast-high'
  }

  const isLargeFont = () => {
    return state.fontSize === 'font-large' || state.fontSize === 'font-extra-large'
  }

  const contextValue = {
    // Estado
    ...state,
    
    // Acciones
    setFontSize,
    setContrastMode,
    toggleReducedMotion,
    loadAccessibilityPreferences,
    resetPreferences,
    applyAccessibilityClasses,
    announce,
    clearAnnouncements,
    
    // Utilidades
    getFontSizeLabel,
    getContrastLabel,
    isHighContrast,
    isLargeFont
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilityContext debe ser usado dentro de AccessibilityProvider')
  }
  return context
}

export default AccessibilityContext