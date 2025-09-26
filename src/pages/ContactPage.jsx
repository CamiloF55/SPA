import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAnnouncement } from '../hooks/useAnnouncement'
import { useFocusManagement } from '../hooks/useFocusManagement'
import '../styles/index.css'

/**
 * Página de Contacto con formulario completamente accesible
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [charCount, setCharCount] = useState(0)

  const { 
    announce, 
    announceFormValidation, 
    announceError, 
    announceSuccess,
    announceLoading 
  } = useAnnouncement()
  
  const { focusElement } = useFocusManagement()

  // Opciones para el campo de asunto
  const subjectOptions = [
    { value: '', label: 'Selecciona el tipo de consulta' },
    { value: 'consulta-general', label: 'Consulta general' },
    { value: 'sugerencia-mejora', label: 'Sugerencia de mejora' },
    { value: 'problema-tecnico', label: 'Problema técnico' },
    { value: 'problema-accesibilidad', label: 'Problema de accesibilidad' },
    { value: 'contenido-educativo', label: 'Solicitud de contenido educativo' },
    { value: 'colaboracion', label: 'Propuesta de colaboración' }
  ]

  // Manejar cambios en los campos
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Actualizar contador de caracteres para el mensaje
    if (name === 'message') {
      setCharCount(value.length)
    }

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validación en tiempo real al salir del campo
  const handleBlur = (event) => {
    const { name, value } = event.target
    const fieldError = validateField(name, value.trim())
    
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }))
      announceFormValidation(fieldError, true)
    }
  }

  // Validar campo individual
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'El nombre completo es requerido'
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
        if (value.length > 100) return 'El nombre no puede exceder 100 caracteres'
        return ''

      case 'email':
        if (!value) return 'El correo electrónico es requerido'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Por favor ingresa un correo electrónico válido'
        if (value.length > 150) return 'El correo electrónico no puede exceder 150 caracteres'
        return ''

      case 'subject':
        if (!value) return 'Por favor selecciona el tipo de consulta'
        return ''

      case 'message':
        if (!value) return 'El mensaje es requerido'
        if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres'
        if (value.length > 1000) return 'El mensaje no puede exceder 1000 caracteres'
        return ''

      default:
        return ''
    }
  }

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {}
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key].trim())
      if (error) {
        newErrors[key] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        focusElement(`#${firstErrorField}`, {
          announce: true,
          announceText: 'Revisa los errores en el formulario'
        })
      }
      announceFormValidation('Se encontraron errores en el formulario. Por favor revisa los campos marcados.', true)
      return
    }

    setIsSubmitting(true)
    announceLoading(true, 'formulario de contacto')

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      announceSuccess(`Mensaje enviado correctamente a ${formData.email}`)
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setCharCount(0)
      
      // Enfocar mensaje de éxito
      setTimeout(() => {
        focusElement('#form-status')
      }, 100)
      
    } catch (error) {
      setSubmitStatus('error')
      announceError('No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.')
      console.error('Error enviando formulario:', error)
    } finally {
      setIsSubmitting(false)
      announceLoading(false, 'formulario de contacto')
    }
  }

  return (
    <>
      <Helmet>
        <title>Contacto - Portal de Recursos Educativos Accesibles</title>
        <meta 
          name="description" 
          content="Contáctanos para consultas, sugerencias o reportar problemas de accesibilidad. Estamos comprometidos con mejorar continuamente nuestro portal educativo." 
        />
        <meta name="keywords" content="contacto, soporte, accesibilidad, consultas, portal educativo" />
      </Helmet>

      <div className="contact-page">
        <h1 id="contact-title" tabIndex={-1}>
          Contacto y Soporte
        </h1>

        {/* Introducción */}
        <section className="intro-section" aria-labelledby="hero-title">
          <div className="card">
            <h2 id="hero-title">Estamos Aquí para Ayudarte</h2>
            <p className="lead">
              ¿Tienes preguntas, sugerencias o encontraste algún problema de accesibilidad? 
              Nos encantaría escucharte. Tu feedback es fundamental para mejorar continuamente 
              nuestro portal educativo.
            </p>
            <p>
              Completa el formulario a continuación y te responderemos lo antes posible. 
              También puedes usar nuestros métodos de contacto alternativos.
            </p>
          </div>
        </section>

        {/* Formulario de contacto */}
        <section className="form-section" aria-labelledby="form-title">
          <div className="card">
            <h2 id="form-title">Formulario de Contacto</h2>
            
            <form 
              id="contact-form" 
              onSubmit={handleSubmit}
              noValidate
              aria-label="Formulario de contacto accesible"
            >
              {/* Fila de datos personales */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="required">
                    <span className="field-icon" aria-hidden="true">👤</span>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby="name-error name-help"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    autoComplete="name"
                    maxLength={100}
                    className={errors.name ? 'error' : ''}
                  />
                  <div id="name-help" className="help-text">
                    Tu nombre completo para personalizar nuestra respuesta
                  </div>
                  {errors.name && (
                    <div id="name-error" className="error-message active" role="alert">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="required">
                    <span className="field-icon" aria-hidden="true">📧</span>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby="email-error email-help"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    autoComplete="email"
                    maxLength={150}
                    className={errors.email ? 'error' : ''}
                  />
                  <div id="email-help" className="help-text">
                    Dirección de correo donde recibirás nuestra respuesta
                  </div>
                  {errors.email && (
                    <div id="email-error" className="error-message active" role="alert">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo de consulta */}
              <div className="form-group">
                <label htmlFor="subject" className="required">
                  <span className="field-icon" aria-hidden="true">🏷️</span>
                  Tipo de consulta
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="subject-error subject-help"
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  className={errors.subject ? 'error' : ''}
                >
                  {subjectOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div id="subject-help" className="help-text">
                  Selecciona la categoría que mejor describa tu consulta
                </div>
                {errors.subject && (
                  <div id="subject-error" className="error-message active" role="alert">
                    {errors.subject}
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div className="form-group">
                <label htmlFor="message" className="required">
                  <span className="field-icon" aria-hidden="true">💬</span>
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="message-error message-help"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  placeholder="Describe tu consulta de manera detallada..."
                  maxLength={1000}
                  className={errors.message ? 'error' : ''}
                />
                <div id="message-help" className="help-text">
                  Mínimo 10 caracteres. Máximo 1000 caracteres.
                  <span 
                    className={`char-count ${charCount > 950 ? 'char-count-warning' : ''}`}
                    aria-live="polite"
                  >
                    {charCount}/1000
                  </span>
                </div>
                {errors.message && (
                  <div id="message-error" className="error-message active" role="alert">
                    {errors.message}
                  </div>
                )}
              </div>

              {/* Botón de envío */}
              <div className="form-group">
                <button 
                  type="submit" 
                  className={`btn btn-primary submit-button ${isSubmitting ? 'btn-loading' : ''}`}
                  disabled={isSubmitting}
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner" aria-hidden="true"></span>
                      <span>Enviando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon" aria-hidden="true">📤</span>
                      <span>Enviar mensaje</span>
                    </>
                  )}
                </button>
                <div id="submit-help" className="help-text">
                  {isSubmitting 
                    ? 'Procesando tu mensaje, por favor espera...'
                    : 'Haz clic para enviar tu consulta. Responderemos en 24-48 horas.'
                  }
                </div>
              </div>
            </form>

            {/* Estado del formulario */}
            {submitStatus && (
              <div 
                id="form-status" 
                className="form-status"
                role="status" 
                aria-live="polite" 
                aria-atomic="true"
                tabIndex={-1}
              >
                {submitStatus === 'success' && (
                  <div className="alert alert-success" role="alert">
                    <span className="alert-icon" aria-hidden="true">✅</span>
                    <div className="alert-content">
                      <strong>¡Mensaje enviado correctamente!</strong>
                      <p>
                        Gracias por contactarnos. Te responderemos en un plazo de 24-48 horas 
                        a la dirección: <strong>{formData.email || 'tu correo electrónico'}</strong>
                      </p>
                      <p>
                        <small>
                          Si tu consulta es sobre un problema crítico de accesibilidad, 
                          también puedes llamarnos directamente.
                        </small>
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error" role="alert">
                    <span className="alert-icon" aria-hidden="true">❌</span>
                    <div className="alert-content">
                      <strong>Error al enviar el mensaje</strong>
                      <p>
                        Ha ocurrido un problema técnico. Por favor, inténtalo de nuevo 
                        más tarde o utiliza nuestros métodos de contacto alternativos.
                      </p>
                      <button 
                        className="btn btn-secondary retry-button"
                        onClick={() => setSubmitStatus(null)}
                      >
                        <span className="btn-icon" aria-hidden="true">🔄</span>
                        Intentar de nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Métodos de contacto alternativos */}
        <section className="contact-methods" aria-labelledby="methods-title">
          <div className="card">
            <h2 id="methods-title">Métodos de Contacto Alternativos</h2>
            <p>
              Si prefieres contactarnos de otra manera o tienes dificultades con el formulario, 
              puedes usar cualquiera de estos métodos:
            </p>

            <div className="contact-grid">
              <div className="contact-method">
                <h3>
                  <span className="method-icon" aria-hidden="true">📧</span>
                  Correo Electrónico
                </h3>
                <p>
                  <a 
                    href="mailto:accesibilidad@portaleducativo.edu?subject=Consulta desde portal web"
                    className="contact-link"
                  >
                    accesibilidad@portaleducativo.edu
                  </a>
                </p>
                <p className="method-description">
                  Para consultas generales y reportes de accesibilidad. 
                  Incluye "Urgente" en el asunto si es crítico.
                </p>
              </div>

              <div className="contact-method">
                <h3>
                  <span className="method-icon" aria-hidden="true">📞</span>
                  Teléfono
                </h3>
                <p>
                  <a 
                    href="tel:+15551234567"
                    className="contact-link"
                  >
                    +1 (555) 123-4567
                  </a>
                </p>
                <p className="method-description">
                  Línea directa para soporte inmediato. 
                  Disponible para consultas urgentes de accesibilidad.
                </p>
              </div>

              <div className="contact-method">
                <h3>
                  <span className="method-icon" aria-hidden="true">🕒</span>
                  Horario de Atención
                </h3>
                <div className="schedule">
                  <p><strong>Lunes a viernes:</strong> 9:00 AM - 5:00 PM</p>
                  <p><strong>Fines de semana:</strong> Emergencias solamente</p>
                  <p><strong>Zona horaria:</strong> UTC-5 (Hora del Este)</p>
                </div>
                <p className="method-description">
                  Fuera del horario, responderemos a primera hora del siguiente día hábil.
                </p>
              </div>

              <div className="contact-method">
                <h3>
                  <span className="method-icon" aria-hidden="true">⚡</span>
                  Tiempo de Respuesta
                </h3>
                <ul className="response-times">
                  <li><strong>Consultas generales:</strong> 24-48 horas</li>
                  <li><strong>Problemas de accesibilidad:</strong> 12-24 horas</li>
                  <li><strong>Emergencias críticas:</strong> 2-4 horas</li>
                  <li><strong>Sugerencias de mejora:</strong> 3-5 días</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Información adicional */}
        <section className="additional-info" aria-labelledby="info-title">
          <div className="card info-card">
            <h2 id="info-title">Información Útil para tu Consulta</h2>
            
            <div className="info-sections">
              <div className="info-section">
                <h3>
                  <span className="section-icon" aria-hidden="true">🔍</span>
                  Para Reportar Problemas de Accesibilidad
                </h3>
                <p>Ayúdanos a solucionarlo más rápido incluyendo:</p>
                <ul>
                  <li>Descripción detallada del problema</li>
                  <li>Página específica donde ocurre</li>
                  <li>Navegador y versión utilizada</li>
                  <li>Tecnología de asistencia empleada (si aplica)</li>
                  <li>Pasos para reproducir el problema</li>
                </ul>
              </div>

              <div className="info-section">
                <h3>
                  <span className="section-icon" aria-hidden="true">💡</span>
                  Para Sugerencias de Mejora
                </h3>
                <p>Valora mucho tu feedback. Dinos:</p>
                <ul>
                  <li>Qué funcionalidad te gustaría ver</li>
                  <li>Cómo mejorarías la experiencia actual</li>
                  <li>Qué recursos educativos necesitas</li>
                  <li>Ideas para hacer el portal más inclusivo</li>
                </ul>
              </div>

              <div className="info-section">
                <h3>
                  <span className="section-icon" aria-hidden="true">🤝</span>
                  Para Colaboraciones
                </h3>
                <p>Si representas una organización educativa:</p>
                <ul>
                  <li>Describe tu propuesta de colaboración</li>
                  <li>Comparte información sobre tu organización</li>
                  <li>Explica cómo beneficiaría a los usuarios</li>
                  <li>Incluye tus datos de contacto profesional</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compromiso de privacidad */}
        <section className="privacy-section" aria-labelledby="privacy-title">
          <div className="card privacy-card">
            <h2 id="privacy-title">Compromiso de Privacidad</h2>
            <div className="privacy-content">
              <p>
                <strong>Protegemos tu información personal.</strong> Los datos que compartas 
                en este formulario solo se utilizarán para responder a tu consulta.
              </p>
              
              <ul className="privacy-list">
                <li>✅ No compartimos tu información con terceros</li>
                <li>✅ No utilizamos tus datos para marketing</li>
                <li>✅ Conservamos tu consulta solo el tiempo necesario</li>
                <li>✅ Puedes solicitar la eliminación de tus datos</li>
              </ul>

              <p>
                <small>
                  Para consultas sobre privacidad, escribe a: 
                  <a href="mailto:privacidad@portaleducativo.edu">privacidad@portaleducativo.edu</a>
                </small>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ContactPage