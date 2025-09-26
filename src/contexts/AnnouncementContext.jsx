import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

// Context para manejar anuncios de accesibilidad
const AnnouncementContext = createContext()

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([])
  const announcementQueue = useRef([])
  const isProcessing = useRef(false)

  // Procesar cola de anuncios
  const processQueue = useCallback(() => {
    if (isProcessing.current || announcementQueue.current.length === 0) {
      return
    }

    isProcessing.current = true
    const nextAnnouncement = announcementQueue.current.shift()

    setAnnouncements(current => [
      ...current,
      {
        id: Date.now() + Math.random(),
        ...nextAnnouncement,
        timestamp: Date.now()
      }
    ])

    // Limpiar anuncio después de 3 segundos
    setTimeout(() => {
      setAnnouncements(current => 
        current.filter(a => a.id !== nextAnnouncement.id)
      )
      
      isProcessing.current = false
      
      // Procesar siguiente anuncio en la cola
      if (announcementQueue.current.length > 0) {
        setTimeout(processQueue, 100)
      }
    }, 3000)
  }, [])

  // Función principal para hacer anuncios
  const announce = useCallback((message, priority = 'polite', options = {}) => {
    if (!message || typeof message !== 'string') {
      console.warn('⚠️ Mensaje de anuncio inválido:', message)
      return
    }

    const announcement = {
      message: message.trim(),
      priority: ['polite', 'assertive'].includes(priority) ? priority : 'polite',
      category: options.category || 'general',
      timeout: options.timeout || 3000,
      skipQueue: options.skipQueue || false
    }

    console.log(`📢 Anuncio programado (${announcement.priority}): ${announcement.message}`)

    if (announcement.skipQueue || announcement.priority === 'assertive') {
      // Anuncios urgentes se procesan inmediatamente
      setAnnouncements(current => [
        ...current,
        {
          id: Date.now() + Math.random(),
          ...announcement,
          timestamp: Date.now()
        }
      ])

      setTimeout(() => {
        setAnnouncements(current => 
          current.filter(a => a.timestamp !== announcement.timestamp)
        )
      }, announcement.timeout)
    } else {
      // Anuncios normales van a la cola
      announcementQueue.current.push(announcement)
      processQueue()
    }
  }, [processQueue])

  // Anuncios específicos para diferentes situaciones
  const announceNavigation = useCallback((pageName, route) => {
    announce(`Navegaste a: ${pageName}`, 'polite', {
      category: 'navigation'
    })
  }, [announce])

  const announceFormValidation = useCallback((message, isError = false) => {
    announce(message, isError ? 'assertive' : 'polite', {
      category: 'form-validation',
      skipQueue: isError
    })
  }, [announce])

  const announceContentChange = useCallback((message) => {
    announce(message, 'polite', {
      category: 'content-change'
    })
  }, [announce])

  const announceStatusChange = useCallback((message) => {
    announce(message, 'polite', {
      category: 'status'
    })
  }, [announce])

  const announceError = useCallback((message) => {
    announce(`Error: ${message}`, 'assertive', {
      category: 'error',
      skipQueue: true,
      timeout: 5000
    })
  }, [announce])

  const announceSuccess = useCallback((message) => {
    announce(`Éxito: ${message}`, 'polite', {
      category: 'success'
    })
  }, [announce])

  const announceLoading = useCallback((isLoading, context = '') => {
    if (isLoading) {
      announce(`Cargando${context ? ` ${context}` : ''}...`, 'polite', {
        category: 'loading'
      })
    } else {
      announce(`Carga completada${context ? ` de ${context}` : ''}`, 'polite', {
        category: 'loading'
      })
    }
  }, [announce])

  // Limpiar todos los anuncios
  const clearAllAnnouncements = useCallback(() => {
    setAnnouncements([])
    announcementQueue.current = []
    isProcessing.current = false
    console.log('🧹 Todos los anuncios han sido limpiados')
  }, [])

  // Obtener anuncios por categoría
  const getAnnouncementsByCategory = useCallback((category) => {
    return announcements.filter(a => a.category === category)
  }, [announcements])

  // Estado del sistema de anuncios
  const getAnnouncementStats = useCallback(() => {
    return {
      active: announcements.length,
      queued: announcementQueue.current.length,
      processing: isProcessing.current,
      categories: [...new Set(announcements.map(a => a.category))]
    }
  }, [announcements])

  const contextValue = {
    announcements,
    announce,
    announceNavigation,
    announceFormValidation,
    announceContentChange,
    announceStatusChange,
    announceError,
    announceSuccess,
    announceLoading,
    clearAllAnnouncements,
    getAnnouncementsByCategory,
    getAnnouncementStats
  }

  return (
    <AnnouncementContext.Provider value={contextValue}>
      {children}
    </AnnouncementContext.Provider>
  )
}

export const useAnnouncement = () => {
  const context = useContext(AnnouncementContext)
  if (!context) {
    throw new Error('useAnnouncement debe ser usado dentro de AnnouncementProvider')
  }
  return context
}

export default AnnouncementContext