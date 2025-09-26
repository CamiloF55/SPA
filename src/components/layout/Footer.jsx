import React from 'react'
import { Link } from 'react-router-dom'
import { useAccessibility } from '../../hooks/useAccessibility'


/**
 * Componente Footer accesible
 * Incluye información de contacto, enlaces útiles y datos de accesibilidad
 */
const Footer = () => {
  const { isHighContrast, isLargeFont } = useAccessibility()
  const currentYear = new Date().getFullYear()

  const contactMethods = [
    {
      type: 'email',
      label: 'Correo electrónico',
      value: 'accesibilidad@portaleducativo.edu',
      href: 'mailto:accesibilidad@portaleducativo.edu',
      icon: '📧'
    },
    {
      type: 'phone',
      label: 'Teléfono',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      icon: '📞'
    }
  ]

  const footerLinks = [
    { to: '/accesibilidad', label: 'Declaración de Accesibilidad' },
    { to: '/contacto', label: 'Contacto y Soporte' },
    { href: 'https://www.w3.org/WAI/WCAG21/quickref/', label: 'Pautas WCAG 2.1', external: true }
  ]

  const accessibilityFeatures = [
    'Cumplimiento WCAG 2.1 AA',
    'Compatible con lectores de pantalla',
    'Navegación por teclado completa',
    'Contraste de colores optimizado',
    'Tamaños de fuente personalizables'
  ]

  /* Estilos en línea para forzar layout horizontal y apariencia de "cards".
     Si prefieres, muévelo a tu CSS y quita los `style={...}`. */
  const featuresListStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '1rem',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    alignItems: 'flex-start'
  }

  const featureItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '220px',        // ancho de cada tarjeta; ajusta si quieres más/menos
    minWidth: '160px',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#111111',
    boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
    textAlign: 'center'
  }

  const featureIconStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#27ae60',
    color: '#ffffff',
    fontSize: '20px',
    marginBottom: '0.6rem'
  }

  return (
    <footer className="footer" role="contentinfo" id="footer">
      <div className="footer-content">
        {/* Información principal */}
        <div className="footer-section footer-main">
          <h2 className="footer-title">Portal de Recursos Educativos Accesibles</h2>
          <p className="footer-description">
            Plataforma educativa desarrollada con React, comprometida con la inclusión digital 
            y el acceso universal a recursos educativos de calidad.
          </p>
          
          {/* Estado de accesibilidad actual */}
          <div className="accessibility-status" role="status" aria-label="Estado actual de configuraciones de accesibilidad">
            <h3 className="sr-only">Configuraciones de Accesibilidad Activas</h3>
            <ul className="status-list">
              {isHighContrast && (
                <li className="status-item">
                  <span className="status-icon" aria-hidden="true">🎨</span>
                  Alto contraste activado
                </li>
              )}
              {isLargeFont && (
                <li className="status-item">
                  <span className="status-icon" aria-hidden="true">🔤</span>
                  Texto ampliado activado
                </li>
              )}
              {!isHighContrast && !isLargeFont && (
                <li className="status-item">
                  <span className="status-icon" aria-hidden="true">✅</span>
                  Configuración estándar
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Métodos de contacto */}
        <div className="footer-section footer-contact">
          <h3>Contacto y Soporte</h3>
          <address className="contact-info">
            <ul className="contact-list">
              {contactMethods.map((contact) => (
                <li key={contact.type} className="contact-item">
                  <a 
                    href={contact.href}
                    className="contact-link"
                    aria-label={`${contact.label}: ${contact.value}`}
                  >
                    <span className="contact-icon" aria-hidden="true">{contact.icon}</span>
                    <span className="contact-text">
                      <span className="contact-label">{contact.label}:</span>
                      <span className="contact-value">{contact.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="support-hours">
              <h4>Horario de Soporte</h4>
              <p>
                <time>Lunes a viernes, 9:00 AM - 5:00 PM</time><br />
                <small>Tiempo de respuesta: 24-48 horas</small>
              </p>
            </div>
          </address>
        </div>

{/* Características de accesibilidad */}
<div className="footer-section footer-accessibility">
  <h3>Características de Accesibilidad</h3>

  {/* UL con estilo flex para fila horizontal */}
  <ul className="features-list" role="list">
    {accessibilityFeatures.map((feature, index) => (
      <li key={index} className="feature-item">
        <div className="feature-icon" aria-hidden="true">✅</div>
        <span className="lead">{feature}</span>
      </li>
    ))}
  </ul>
  
  <div className="wcag-compliance" style={{ marginTop: '0.75rem' }}>
    <p>
      <strong>Certificación:</strong> Este sitio cumple con las pautas 
      <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1 
      nivel <abbr title="AA - Doble A">AA</abbr>
    </p>
  </div>
</div>

        {/* Enlaces útiles */}
        <div className="footer-section footer-links">
          <h3>Enlaces Útiles</h3>
          <nav aria-label="Enlaces útiles del pie de página">
            <ul className="footer-nav-list">
              {footerLinks.map((link, index) => (
                <li key={index} className="footer-nav-item">
                  {link.external ? (
                    <a
                      href={link.href}
                      className="footer-nav-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-describedby={`external-link-${index}`}
                    >
                      {link.label}
                      <span className="external-icon" aria-hidden="true">🔗</span>
                      <span id={`external-link-${index}`} className="sr-only">
                        (abre en nueva ventana)
                      </span>
                    </a>
                  ) : (
                    <Link to={link.to} className="footer-nav-link">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Barra de copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} Portal de Recursos Educativos Accesibles. 
            Todos los derechos reservados.
          </p>
          
          <p className="tech-info">
            Desarrollado con ❤️ usando React y principios de 
            <abbr title="Diseño Universal">diseño universal</abbr>
          </p>
          
          <p className="commitment">
            <strong>Comprometidos con la educación inclusiva para todos</strong>
          </p>
        </div>
      </div>

      {/* Información de versión para debugging (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="footer-debug" aria-hidden="true">
          <details>
            <summary>Información de Desarrollo</summary>
            <dl className="debug-info">
              <dt>Versión React:</dt>
              <dd>{React.version}</dd>
              <dt>Entorno:</dt>
              <dd>{import.meta.env.MODE}</dd>
              <dt>Build:</dt>
              <dd>{import.meta.env.DEV ? 'Desarrollo' : 'Producción'}</dd>
              <dt>Última actualización:</dt>
              <dd>{new Date().toLocaleString()}</dd>
            </dl>
          </details>
        </div>
      )}
    </footer>
  )
}

export default Footer
