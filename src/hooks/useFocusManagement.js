import { useAccessibilityContext } from '../contexts/AccessibilityContext'

/**
 * Hook personalizado para acceder a todas las funcionalidades de accesibilidad
 * Proporciona una interfaz simplificada para los componentes
 */
export const useAccessibility = () => {
  const context = useAccessibilityContext()
  
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de AccessibilityProvider')
  }

  return {
    // Estado actual
    fontSize: context.fontSize,
    contrastMode: context.contrastMode,
    reducedMotion: context.reducedMotion,
    screenReaderMode: context.screenReaderMode,
    keyboardNavigation: context.keyboardNavigation,
    focusVisible: context.focusVisible,
    preferences: context.preferences,
    
    // Acciones principales
    setFontSize: context.setFontSize,
    setContrastMode: context.setContrastMode,
    toggleReducedMotion: context.toggleReducedMotion,
    loadAccessibilityPreferences: context.loadAccessibilityPreferences,
    resetPreferences: context.resetPreferences,
    applyAccessibilityClasses: context.applyAccessibilityClasses,
    
    // Utilidades
    getFontSizeLabel: context.getFontSizeLabel,
    getContrastLabel: context.getContrastLabel,
    isHighContrast: context.isHighContrast,
    isLargeFont: context.isLargeFont,
    
    // Funciones de anuncio
    announce: context.announce,
    clearAnnouncements: context.clearAnnouncements
  }
}

/**
 * Hook personalizado para manejar la gestión del foco.
 */
export const useFocusManagement = () => {
  const context = useAccessibilityContext()

  if (!context) {
    throw new Error('useFocusManagement debe ser usado dentro de AccessibilityProvider')
  }

  return {
    focusElement: context.focusElement,
    setFocusElement: context.setFocusElement,
  }
}