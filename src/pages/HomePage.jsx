import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAccessibility } from '../hooks/useAccessibility'
import { useAnnouncement } from '../hooks/useAnnouncement'
import '../styles/index.css'

/**
 * Página de Inicio con herramientas de accesibilidad
 * Incluye controles para personalizar la experiencia del usuario
 */
const HomePage = () => {
  const {
    fontSize,
    contrastMode,
    reducedMotion,
    setFontSize,
    setContrastMode,
    toggleReducedMotion,
    getFontSizeLabel,
    getContrastLabel,
    isHighContrast,
    isLargeFont,
    preferences
  } = useAccessibility()

  const { announce, announceSuccess } = useAnnouncement()
  
  const [testMode, setTestMode] = useState(false)

  // Efecto para mostrar debug en desarrollo
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🏠 HomePage montada con preferencias:', {
        fontSize,
        contrastMode,
        reducedMotion,
        preferences
      })
    }
  }, [fontSize, contrastMode, reducedMotion, preferences])

  const handleFontSizeChange = (event) => {
    const newSize = event.target.value
    setFontSize(newSize)
    console.log(`🔤 Usuario cambió tamaño de fuente a: ${newSize}`)
  }

  const handleContrastChange = (event) => {
    const newMode = event.target.value
    setContrastMode(newMode)
    console.log(`🎨 Usuario cambió contraste a: ${newMode}`)
  }

  const handleTestAccessibilityFeatures = () => {
    setTestMode(true)
    
    // Realizar una demostración de las funciones
    announce('Iniciando prueba de características de accesibilidad', 'polite')
    
    setTimeout(() => {
      announceSuccess('Características de accesibilidad funcionando correctamente')
      setTestMode(false)
    }, 2000)
  }

const keyboardShortcuts = [
  { keys: 'Alt + 1', description: <span className="lead">Ir a página de Inicio</span> },
  { keys: 'Alt + 2', description: <span className="lead">Ir a Recursos Educativos</span> },
  { keys: 'Alt + 3', description: <span className="lead">Ir a página de Contacto</span> },
  { keys: 'Alt + 4', description: <span className="lead">Ir a Declaración de Accesibilidad</span> },
  { keys: 'Ctrl + K', description: <span className="lead">Enfocar búsqueda (en página de recursos)</span> },
  { keys: 'Tab / Shift + Tab', description: <span className="lead">Navegar entre elementos</span> },
  { keys: 'Enter / Espacio', description: <span className="lead">Activar elemento enfocado</span> },
  { keys: 'Escape', description: <span className="lead">Cerrar menús o diálogos</span> }

  ]

  const accessibilityFeatures = [
    {
      title: 'Navegación Universal',
      description: 'Compatible con lectores de pantalla, navegación por teclado y dispositivos de asistencia',
      icon: '⌨️'
    },
    {
      title: 'Contenido Inclusivo',
      description: 'Recursos adaptados para diferentes estilos de aprendizaje y necesidades',
      icon: '🎯'
    },
    {
      title: 'Diseño Responsive',
      description: 'Optimizado para computadoras, tablets y dispositivos móviles',
      icon: '📱'
    },
    {
      title: 'Estándares WCAG 2.1 AA',
      description: 'Cumple y supera las pautas internacionales de accesibilidad web',
      icon: '✅'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Inicio - Portal de Recursos Educativos Accesibles</title>
        <meta 
          name="description" 
          content="Página principal del Portal de Recursos Educativos Accesibles. Configure sus preferencias de accesibilidad y explore nuestras características inclusivas." 
        />
        <meta name="keywords" content="educación accesible, inicio, portal educativo, WCAG 2.1, React" />
      </Helmet>

      <div className="home-page">
        <h1 class="footer-title" id="home-title" tabIndex={-1}>
          Bienvenido al Portal de Recursos Educativos Accesibles
        </h1>

        {/* Introducción principal */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="card hero-card">
            <h2 class="heading" id="hero-title">Educación Inclusiva para Todos</h2>
            <p className="lead">
              Este portal está diseñado para proporcionar recursos educativos de calidad, 
              garantizando el acceso universal independientemente de las capacidades de cada persona.
            </p>
            <p>
              Desarrollado con React siguiendo los más altos estándares de accesibilidad web, 
              este sitio cumple con las pautas WCAG 2.1 nivel AA para ofrecer una experiencia 
              verdaderamente inclusiva.
            </p>
          </div>
        </section>

        {/* Herramientas de Accesibilidad */}
        <section className="accessibility-tools" aria-labelledby="accessibility-title">
          <div className="card hero-card">
            <h2 class="heading" id="accessibility-title">Herramientas de Accesibilidad</h2>
            <p>
              Personaliza tu experiencia de navegación usando las siguientes herramientas. 
              Tus preferencias se guardarán automáticamente.
            </p>

            <div className="controls-grid">
              {/* Control de tamaño de fuente */}
              <div className="control-group">
                <label htmlFor="font-size-control" className="control-label">
                  <span  className="control-icon" aria-hidden="true">🔤</span>
                  Tamaño de fuente:
                </label>
                <select
                  id="font-size-control"
                  className="control-select"
                  value={preferences.fontSize}
                  onChange={handleFontSizeChange}
                  aria-describedby="font-size-help"
                >
                  <option value="normal">Normal (16px)</option>
                  <option value="large">Grande (18px)</option>
                  <option value="extra-large">Extra grande (20px)</option>
                </select>
                <div id="font-size-help" className="control-help">
                  Ajusta el tamaño del texto para mejorar la legibilidad. 
                  Los títulos también se escalarán proporcionalmente.
                </div>
              </div>

              {/* Control de contraste */}
              <div className="control-group">
                <label htmlFor="contrast-control" className="control-label">
                  <span className="control-icon" aria-hidden="true">🎨</span>
                  Modo de contraste:
                </label>
                <select
                  id="contrast-control"
                  className="control-select"
                  value={preferences.contrastMode}
                  onChange={handleContrastChange}
                  aria-describedby="contrast-help"
                >
                  <option value="normal">Contraste normal</option>
                  <option value="high">Alto contraste</option>
                </select>
                <div id="contrast-help" className="control-help">
                  Activa el alto contraste para mejorar la visibilidad con 
                  colores de fondo negro y texto blanco.
                </div>
              </div>

              {/* Control de movimiento reducido */}
              <div className="control-group">
                <label htmlFor="motion-control" className="control-label">
                  <span className="control-icon" aria-hidden="true">🎭</span>
                  Animaciones:
                </label>
                <button
                  id="motion-control"
                  className={`control-toggle ${reducedMotion ? 'toggle-off' : 'toggle-on'}`}
                  onClick={toggleReducedMotion}
                  aria-describedby="motion-help"
                  aria-pressed={!reducedMotion}
                >
                  <span className="toggle-text">
                    {reducedMotion ? 'Desactivadas' : 'Activadas'}
                  </span>
                </button>
                <div id="motion-help" className="control-help">
                  {reducedMotion ? 
                    'Las animaciones están desactivadas para una experiencia más cómoda.' :
                    'Las animaciones están activadas. Haz clic para desactivarlas.'
                  }
                </div>
              </div>
            </div>

            {/* Área de prueba */}
            <div className="test-section" role="region" aria-labelledby="test-title">
              <h3 class="heading" id="test-title">Prueba los Cambios</h3>
              <p className="test-description">
                Haz cambios en los controles de arriba y observa cómo se actualiza este texto inmediatamente. 
                Las configuraciones se guardan automáticamente en tu navegador.
              </p>
              
              <div className="test-demo">
                <h4>Texto de Demostración</h4>
                <p>
                  Este es un párrafo de ejemplo que cambiará según tus configuraciones. 
                  Puedes ver cómo el tamaño de fuente se ajusta y cómo cambian los colores 
                  en modo de alto contraste.
                </p>
                
                <button 
                  className={`btn test-button ${testMode ? 'btn-testing' : ''}`}
                  onClick={handleTestAccessibilityFeatures}
                  disabled={testMode}
                  aria-describedby="test-button-help"
                >
                  {testMode ? 'Probando...' : 'Probar Funciones'}
                </button>
                
                <div id="test-button-help" className="sr-only">
                  Botón para probar el sistema de anuncios y verificar que las funciones de accesibilidad están trabajando
                </div>
              </div>
            </div>

            {/* Estado actual */}
            <div className="current-settings" role="status" aria-labelledby="current-settings-title">
              <h3 id="current-settings-title">Configuración Actual</h3>
<ul class="settings-list">
  <li><strong class="lead">Tamaño de fuente:</strong> <span class="status-badge">Ampliado</span></li>
  <li><strong class="lead">Contraste:</strong> <span class="status-badge">Alto contraste</span></li>
  <li><strong class="lead">Animaciones:</strong> <span class="status-badge">Activadas</span></li>
</ul>

            </div>
          </div>
        </section>

        {/* Características principales */}
        <section className="features-section" aria-labelledby="features-title">
          <div className="card">
            <h2 class="footer-title" id="features-title">Características Principales</h2>
            <div className="features-grid">
              {accessibilityFeatures.map((feature, index) => (
                <div key={index} className="feature-item" role="article">
                  <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Atajos de teclado */}
        <section className="keyboard-shortcuts" aria-labelledby="shortcuts-title">
          <div className="card">
            <h2 class="footer-title" id="shortcuts-title">Atajos de Teclado</h2>
            <p>
              Usa estos atajos de teclado para navegar más eficientemente por el sitio:
            </p>
            
            <div className="shortcuts-table-wrapper">
              <table className="shortcuts-table" role="table">
                <caption className="sr-only">
                  Lista de atajos de teclado disponibles en el portal
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Atajo</th>
                    <th scope="col">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {keyboardShortcuts.map((shortcut, index) => (
                    <tr key={index}>
                      <td >
                        <kbd className="keyboard-key">{shortcut.keys}</kbd>
                      </td>
                      <td>{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="shortcuts-note">
              <p>
                <strong>Nota:</strong> Los atajos con Alt funcionan desde cualquier página. 
                La navegación por Tab funciona en todos los elementos interactivos.
              </p>
            </div>
          </div>
        </section>

        {/* Tecnologías de asistencia compatibles */}
        <section className="assistive-tech" aria-labelledby="assistive-tech-title">
          <div className="card">
            <h2 class="footer-title" id="assistive-tech-title">Tecnologías de Asistencia Compatibles</h2>
            <p>
              Este portal ha sido probado y es compatible con las siguientes tecnologías de asistencia:
            </p>
            
            <div className="tech-categories">
              <div className="tech-category">
                <h3>Lectores de Pantalla</h3>
                <ul>
                  <li>🔊 <strong>NVDA</strong> (Windows) - Totalmente compatible</li>
                  <li>🔊 <strong>JAWS</strong> (Windows) - Totalmente compatible</li>
                  <li>🔊 <strong>VoiceOver</strong> (macOS/iOS) - Totalmente compatible</li>
                  <li>🔊 <strong>TalkBack</strong> (Android) - Totalmente compatible</li>
                  <li>🔊 <strong>Narrator</strong> (Windows) - Compatible</li>
                </ul>
              </div>
              
              <div className="tech-category">
                <h3>Navegadores Probados</h3>
                <ul>
                  <li>🌐 Chrome (versión actual y anterior)</li>
                  <li>🌐 Firefox (versión actual y anterior)</li>
                  <li>🌐 Safari (macOS e iOS)</li>
                  <li>🌐 Edge (versión actual)</li>
                </ul>
              </div>
              
              <div className="tech-category">
                <h3>Dispositivos de Entrada</h3>
                <ul>
                  <li>⌨️ Teclado estándar y adaptativo</li>
                  <li>🖱️ Mouse y dispositivos de puntero</li>
                  <li>👆 Pantalla táctil y gestos</li>
                  <li>🎤 Controles por voz</li>
                  <li>🔘 Interruptores (switch devices)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Llamada a la acción */}
        <section className="cta-section" aria-labelledby="cta-title">
          <div className="card cta-card">
            <h2 id="cta-title">Comienza a Explorar</h2>
            <p>
              Ahora que has configurado tus preferencias de accesibilidad, 
              explora nuestros recursos educativos diseñados para todos.
            </p>
            
            <div className="cta-buttons">
              <a href="/recursos" className="btn btn-primary cta-button">
                <span className="btn-icon" aria-hidden="true">📚</span>
                Explorar Recursos
              </a>
              
              <a href="/accesibilidad" className="btn btn-secondary cta-button">
                <span className="btn-icon" aria-hidden="true">♿</span>
                Ver Declaración de Accesibilidad
              </a>
            </div>
          </div>
        </section>

        {/* Información adicional para desarrolladores */}
        {import.meta.env.DEV && (
          <section className="dev-info" aria-labelledby="dev-info-title">
            <div className="card dev-card">
              <h2 class="footer-title" id="dev-info-title">Información de Desarrollo</h2>
              <details>
                <summary>Estado de Debugging de Accesibilidad</summary>
                <dl className="debug-list">
                  <dt>Modo de desarrollo:</dt>
                  <dd>Activo</dd>
                  
                  <dt>axe-core:</dt>
                  <dd>Configurado para auditoría automática</dd>
                  
                  <dt>Preferencias actuales:</dt>
                  <dd>
                    <code>{JSON.stringify(preferences, null, 2)}</code>
                  </dd>
                  
                  <dt>Clases CSS aplicadas:</dt>
                  <dd>
                    <code>{document.body.className}</code>
                  </dd>
                  
                  <dt>Última actualización:</dt>
                  <dd>{new Date().toLocaleString()}</dd>
                </dl>
              </details>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default HomePage