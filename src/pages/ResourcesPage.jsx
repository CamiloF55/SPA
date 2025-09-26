import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useAnnouncement } from '../hooks/useAnnouncement'
import '../styles/index.css'

/**
 * Página de Recursos Educativos con sistema de filtros accesible
 */
const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [filteredResources, setFilteredResources] = useState([])
  const { createArrowNavigation } = useKeyboardNavigation()
  const { announce, announceContentChange } = useAnnouncement()

  // Recursos de ejemplo
  const resources = [
    {
      id: 1,
      title: 'Matemáticas Básicas Interactivas',
      description: 'Aprende conceptos fundamentales de matemáticas con ejercicios interactivos, compatibles con lectores de pantalla y navegación por teclado.',
      category: 'matematicas',
      tags: ['básico', 'interactivo', 'accesible'],
      level: 'Básico',
      format: 'Interactivo'
    },
    {
      id: 2,
      title: 'Laboratorio Virtual de Ciencias',
      description: 'Experimenta con conceptos científicos en un entorno virtual accesible. Incluye descripciones detalladas y alternativas textuales.',
      category: 'ciencias',
      tags: ['intermedio', 'virtual', 'multimedia'],
      level: 'Intermedio',
      format: 'Virtual'
    },
    {
      id: 3,
      title: 'Comprensión Lectora Adaptativa',
      description: 'Textos con múltiples niveles de dificultad, herramientas de apoyo a la lectura y ejercicios adaptativos según el progreso.',
      category: 'lenguaje',
      tags: ['adaptativo', 'lectura fácil'],
      level: 'Todos los niveles',
      format: 'Adaptativo'
    },
    {
      id: 4,
      title: 'Historia Interactive Timeline',
      description: 'Explora acontecimientos históricos a través de una línea de tiempo accesible con descripciones detalladas y navegación por teclado.',
      category: 'historia',
      tags: ['intermedio', 'timeline', 'narrativo'],
      level: 'Intermedio',
      format: 'Timeline'
    },
    {
      id: 5,
      title: 'Arte y Creatividad Inclusiva',
      description: 'Actividades artísticas adaptadas para diferentes capacidades, con instrucciones claras y materiales alternativos.',
      category: 'arte',
      tags: ['creativo', 'inclusivo', 'hands-on'],
      level: 'Todos los niveles',
      format: 'Práctico'
    },
    {
      id: 6,
      title: 'Geometría Táctil Digital',
      description: 'Aprende geometría con representaciones táctiles digitales y descripciones espaciales detalladas para todos los estudiantes.',
      category: 'matematicas',
      tags: ['avanzado', 'táctil', '3d'],
      level: 'Avanzado',
      format: 'Táctil'
    }
  ]

  // Filtrar recursos
  useEffect(() => {
    let filtered = resources

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    setFilteredResources(filtered)

    // Anunciar cambios en resultados
    const message = `Mostrando ${filtered.length} de ${resources.length} recursos`
    announceContentChange(message)
  }, [searchTerm, selectedCategory, announceContentChange])

  // Configurar navegación con flechas para la grilla de recursos
  useEffect(() => {
    const cleanup = createArrowNavigation('.resource-grid', {
      itemSelector: '.resource-card button',
      orientation: 'both',
      loop: true
    })
    return cleanup
  }, [createArrowNavigation, filteredResources])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('todas')
    const searchInput = document.getElementById('search-resources')
    if (searchInput) {
      searchInput.focus()
    }
    announce('Filtros eliminados. Mostrando todos los recursos.', 'polite')
  }

  const categories = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'matematicas', label: 'Matemáticas' },
    { value: 'ciencias', label: 'Ciencias' },
    { value: 'lenguaje', label: 'Lenguaje' },
    { value: 'historia', label: 'Historia' },
    { value: 'arte', label: 'Arte' }
  ]

  return (
    <>
      <Helmet>
        <title>Recursos Educativos - Portal Accesible</title>
        <meta 
          name="description" 
          content="Explora nuestra colección de recursos educativos accesibles, organizados por categorías y niveles. Todos compatibles con tecnologías de asistencia." 
        />
        <meta name="keywords" content="recursos educativos, accesible, matemáticas, ciencias, lenguaje, historia, arte" />
      </Helmet>

      <div className="resources-page">
        <h1 id="resources-title" tabIndex={-1}>
          Recursos Educativos Accesibles
        </h1>

        {/* Introducción */}
        <section className="intro-section" aria-labelledby="intro-title">
          <div className="card hero-card">
            <h2 className="heading" id="intro-title">Encuentra Recursos para Todos</h2>
            <p className="lead">
              Explora nuestra colección de recursos educativos accesibles, diseñados 
              específicamente para ser utilizables por personas con diferentes capacidades 
              y estilos de aprendizaje.
            </p>
            <p>
              Todos nuestros recursos incluyen descripciones detalladas, alternativas textuales, 
              navegación por teclado y compatibilidad con lectores de pantalla.
            </p>
          </div>
        </section>

        {/* Filtros de búsqueda */}
        <section className="filters-section" aria-labelledby="filters-title">
          <div className="filters" role="search" aria-labelledby="filters-title">
            <h2 id="filters-title">Filtrar Recursos</h2>
            
            <div className="filter-row">
              <div className="form-group">
                <label htmlFor="search-resources">
                  <span className="search-icon" aria-hidden="true">🔍</span>
                  Buscar recursos:
                </label>
                <input
                  type="search"
                  id="search-resources"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Ingresa términos de búsqueda..."
                  aria-describedby="search-help"
                />
                <div id="search-help" class="help-text">
                  Busca por título, descripción o etiquetas del recurso
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category-filter">
                  <span className="category-icon" aria-hidden="true">📂</span>
                  Categoría:
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                className="clear-filters"
                onClick={clearFilters}
                aria-describedby="clear-help"
              >
                <span className="clear-icon" aria-hidden="true">🧹</span>
                Limpiar filtros
              </button>
              <div id="clear-help" className="sr-only">
                Elimina todos los filtros aplicados y muestra todos los recursos
              </div>
            </div>
          </div>
        </section>

        {/* Resumen de resultados */}
        <div 
          className="results-summary" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          <p>
            <strong>Resultados:</strong> Mostrando {filteredResources.length} de {resources.length} recursos
            {searchTerm && <span> para "{searchTerm}"</span>}
            {selectedCategory !== 'todas' && <span> en categoría {categories.find(c => c.value === selectedCategory)?.label}</span>}
          </p>
        </div>

        {/* Grid de recursos */}
        <section className="resources-section" aria-labelledby="resources-grid-title">
          <h2 id="resources-grid-title" className="sr-only">Lista de recursos educativos</h2>
          
          {filteredResources.length > 0 ? (
            <div className="resource-grid" role="region" aria-label="Recursos educativos disponibles">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="resource-card">
                  <header className="resource-header">
                    <h3 className="resource-title">{resource.title}</h3>
                    <div className="resource-meta">
                      <span className="resource-level">
                        <span className="sr-only">Nivel: </span>
                        {resource.level}
                      </span>
                      <span className="resource-format">
                        <span className="sr-only">Formato: </span>
                        {resource.format}
                      </span>
                    </div>
                  </header>

                  <div className="resource-content">
                    <p className="resource-description">{resource.description}</p>
                    
                    <div className="resource-tags" role="list" aria-label="Etiquetas del recurso">
                      <span className="resource-tag primary" role="listitem">
                        {categories.find(c => c.value === resource.category)?.label}
                      </span>
                      {resource.tags.map((tag, index) => (
                        <span key={index} className="resource-tag" role="listitem">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <footer className="resource-footer">
                    <button 
                      className="btn resource-button"
                      aria-describedby={`resource-${resource.id}-desc`}
                      onClick={() => announce(`Abriendo recurso: ${resource.title}`, 'polite')}
                    >
                      <span className="btn-icon" aria-hidden="true">📖</span>
                      Ver recurso
                    </button>
                    <div id={`resource-${resource.id}-desc`} className="sr-only">
                      Abrir recurso: {resource.title}. Nivel {resource.level}, formato {resource.format}
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results" role="status">
              <div className="card no-results-card">
                <h3>No se encontraron recursos</h3>
                <p>
                  No hay recursos que coincidan con tu búsqueda actual. 
                  Intenta con términos diferentes o elimina algunos filtros.
                </p>
                <button 
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  <span className="btn-icon" aria-hidden="true">🔄</span>
                  Mostrar todos los recursos
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Información adicional */}
        <section className="info-section" aria-labelledby="info-title">
          <div className="card hero-card">
            <h2 id="info-title">Sobre Nuestros Recursos</h2>
            <div className="info-grid">
              <div className="info-item">
                <h3>
                  <span className="info-icon" aria-hidden="true">♿</span>
                  Totalmente Accesibles
                </h3>
                <p>
                  Todos los recursos están diseñados siguiendo las pautas WCAG 2.1 AA, 
                  asegurando compatibilidad con tecnologías de asistencia.
                </p>
              </div>
              
              <div className="info-item">
                <h3>
                  <span className="info-icon" aria-hidden="true">🎯</span>
                  Adaptativos
                </h3>
                <p>
                  Los contenidos se adaptan a diferentes estilos de aprendizaje 
                  y necesidades específicas de cada usuario.
                </p>
              </div>
              
              <div className="info-item">
                <h3>
                  <span className="info-icon" aria-hidden="true">📱</span>
                  Multi-dispositivo
                </h3>
                <p>
                  Funcionan perfectamente en computadoras, tablets y dispositivos móviles, 
                  manteniendo la accesibilidad en todos ellos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ResourcesPage