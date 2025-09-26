import React from 'react'

/**
 * Componente de enlaces de salto para accesibilidad
 * Permite a usuarios de teclado y lectores de pantalla saltar directamente al contenido
 */
const SkipLinks = () => {
  const handleSkipToContent = (event) => {
    event.preventDefault()
    const mainContent = document.getElementById('main-content')
    
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
      console.log('🦘 Skip link usado: saltando al contenido principal')
    }
  }

  const handleSkipToNavigation = (event) => {
    event.preventDefault()
    const navigation = document.querySelector('nav[role="navigation"]') || 
                      document.querySelector('nav') ||
                      document.getElementById('main-nav')
    
    if (navigation) {
      const firstLink = navigation.querySelector('a, button')
      if (firstLink) {
        firstLink.focus()
        navigation.scrollIntoView({ behavior: 'smooth', block: 'start' })
        console.log('🦘 Skip link usado: saltando a la navegación')
      }
    }
  }

  const handleSkipToFooter = (event) => {
    event.preventDefault()
    const footer = document.querySelector('footer[role="contentinfo"]') || 
                  document.querySelector('footer')
    
    if (footer) {
      footer.focus()
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
      console.log('🦘 Skip link usado: saltando al pie de página')
    }
  }

  return (
    <div className="skip-links" role="navigation" aria-label="Enlaces de salto">
      <a 
        href="#main-content" 
        className="skip-link skip-link-main"
        onClick={handleSkipToContent}
        onFocus={() => console.log('🎯 Skip link enfocado: contenido principal')}
      >
        Saltar al contenido principal
      </a>
      
      <a 
        href="#main-nav" 
        className="skip-link skip-link-nav"
        onClick={handleSkipToNavigation}
        onFocus={() => console.log('🎯 Skip link enfocado: navegación')}
      >
        Saltar a la navegación
      </a>
      
      <a 
        href="#footer" 
        className="skip-link skip-link-footer"
        onClick={handleSkipToFooter}
        onFocus={() => console.log('🎯 Skip link enfocado: pie de página')}
      >
        Saltar al pie de página
      </a>
    </div>
  )
}

export default SkipLinks