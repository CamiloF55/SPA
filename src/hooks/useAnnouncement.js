import { useAnnouncement as useAnnouncementContext } from '../contexts/AnnouncementContext'

/**
 * Wrapper que expone `useAnnouncement` para mantener la compatibilidad con
 * importaciones existentes en los componentes.
 */
export const useAnnouncement = () => {
  return useAnnouncementContext()
}

export default useAnnouncement