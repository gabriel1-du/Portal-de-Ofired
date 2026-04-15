import React, { useState } from 'react';
import '../style/home.css';
import { getPublicacionesByNombre } from '../servicios/publicacionesService';

function PaginaHome() {
  // Estado para controlar si el recuadro de filtros está abierto o cerrado
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');

  // Función que se ejecuta al presionar "Buscar"
  const manejarBusqueda = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!textoBusqueda.trim()) return; // Evita buscar si la barra está vacía

    try {
      const resultados = await getPublicacionesByNombre(textoBusqueda);
      console.log("Resultados de la búsqueda:", resultados);
    } catch (error) {
      console.error("Error al buscar las publicaciones por nombre:", error);
    }
  };

  return (
    <div>
      {/* Navbar Personalizado */}
      <nav className="navbar-busqueda">
        
        {/* Lado Izquierdo: Botón de Filtros y Dropdown */}
        <div className="contenedor-dropdown">
          <button
            className="btn-filtro"
            type="button"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          >
            <span className="filtro-icono">⚙️</span> Filtros
          </button>

          {/* Recuadro de Filtros - Solo se renderiza si filtrosAbiertos es true */}
          {filtrosAbiertos && (
            <div className="filtro-recuadro-flotante shadow">
              <h6 className="titulo-filtro">Opciones de Filtro</h6>
              <form>
                <div className="grupo-input">
                  <label>Región</label>
                  <select className="input-estilo">
                    <option value="">Selecciona una región</option>
                    <option value="1">Metropolitana</option>
                    <option value="2">Valparaíso</option>
                  </select>
                </div>
                
                <div className="grupo-input">
                  <label>Comuna</label>
                  <select className="input-estilo">
                    <option value="">Selecciona una comuna</option>
                    <option value="1">Santiago</option>
                    <option value="2">Providencia</option>
                  </select>
                </div>

                <div className="grupo-input">
                  <label>Tipo de Contenido</label>
                  <select className="input-estilo">
                    <option value="">Selecciona el tipo</option>
                    <option value="oficio">Oficio / Servicio</option>
                    <option value="usuario">Usuario / Cliente</option>
                  </select>
                </div>

                <div className="grupo-input">
                  <label>Desde (Fecha)</label>
                  <input type="date" className="input-estilo" />
                </div>
                
                <button type="button" className="btn-aplicar-filtros">Aplicar Filtros</button>
              </form>
            </div>
          )}
        </div>

        {/* Centro/Derecha: Barra de Búsqueda con Lupa */}
        <form className="contenedor-busqueda" onSubmit={manejarBusqueda}>
          <input
            className="input-busqueda"
            type="search"
            placeholder="Buscar oficios, profesionales, servicios..."
            aria-label="Buscar"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
          />
          <button className="btn-lupa" type="submit" title="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </button>
        </form>

      </nav>

      {/* Contenedor principal */}
      <div className="container mt-4 mi-pagina-contenedor">
        <h3>Contenido Principal</h3>
        <p>Aquí se listarán las tarjetas o resultados de tu aplicación...</p>
      </div>
    </div>
  );
}

export default PaginaHome;