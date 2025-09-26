import React from 'react'
import '../styles/index.css'

const AccessibilityPage = () => {
  return (
    <section className="accessibility-page">
      <header>
        <h1 tabIndex={-1}>Declaración de Accesibilidad</h1>
      </header>

      <p>
        Este portal está diseñado para cumplir con las pautas WCAG 2.1 AA.
        Si detectas problemas de accesibilidad, por favor contáctanos.
      </p>

      <h2>Contacto de accesibilidad</h2>
      <p>
        Correo: <a href="mailto:accesibilidad@portaleducativo.edu">accesibilidad@portaleducativo.edu</a>
      </p>
    </section>
  )
}

export default AccessibilityPage
