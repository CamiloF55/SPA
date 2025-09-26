import React from 'react'
import { useAnnouncement } from '../../hooks/useAnnouncement'

/**
 * Región de anuncios para tecnologías de asistencia
 * Renderiza anuncios en regiones aria-live apropiadas
 */
const AnnouncementRegion = () => {
  const { announcements } = useAnnouncement()

  // Separar anuncios por prioridad
  const politeAnnouncements = announcements.filter(a => a.priority === 'polite')
  const assertiveAnnouncements = announcements.filter(a => a.priority === 'assertive')

  return (
    <>
      {/* Región para anuncios corteses (polite) */}
      <div
        id="polite-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {politeAnnouncements.map(announcement => (
          <div key={announcement.id}>
            {announcement.message}
          </div>
        ))}
      </div>

      {/* Región para anuncios asertivos (assertive) */}
      <div
        id="assertive-announcements"
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
      >
        {assertiveAnnouncements.map(announcement => (
          <div key={announcement.id}>
            {announcement.message}
          </div>
        ))}
      </div>

      {/* Región para anuncios de estado de carga */}
      <div
        id="loading-status"
        className="sr-only"
        aria-live="polite"
        aria-atomic="false"
        role="status"
      >
        {/* Esta región se usa para anuncios específicos de carga */}
      </div>
    </>
  )
}

export default AnnouncementRegion