import React, { useState, useEffect } from 'react';
import '../style/home.css';
import { getPublicacionesByNombre } from '../servicios/publicacionesService';
import PublicacionCard from '../assets/PublicacionesCard.jsx'; // 1. Importamos el nuevo componente
import { getAllRegions } from '../servicios/regionService';
import { buscarUsuariosConFiltros } from '../servicios/busquedaUsuarios.js';
import { buscarPublicacionesConFiltros } from '../servicios/busquedaPublicaciones.js';
import { getAllComunas } from '../servicios/comunasService';

function PaginaHome() {
  // Estado para controlar si el recuadro de filtros está abierto o cerrado
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');

  // --- ESTADOS PARA DATOS DE FILTROS ---
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  // --- ESTADOS PARA LA SELECCIÓN DEL USUARIO ---
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [tipoContenido, setTipoContenido] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');

  // --- MANEJADOR PARA EL CAMBIO DE REGIÓN ---
  const handleRegionChange = (e) => {
    setRegionSeleccionada(e.target.value);
    setComunaSeleccionada(''); // Resetea la comuna cuando cambia la región
  };

  const handleComunaChange = (e) => {
    setComunaSeleccionada(e.target.value);
  };

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

  // Función que se ejecuta al presionar "Aplicar Filtros"
  const handleAplicarFiltros = async () => {
    console.log("Aplicando filtros...");

    // Construimos el objeto de filtros solo con los valores que existen.
    const filtros = {};
    if (regionSeleccionada) filtros.idRegion = regionSeleccionada;
    if (comunaSeleccionada) filtros.idComuna = comunaSeleccionada;
    if (fechaDesde) filtros.fecha = fechaDesde;

    console.log("Filtros a enviar a la API:", filtros, "para tipo:", tipoContenido);

    if (tipoContenido === 'usuario') {
      try {
        // Llamamos a la función del servicio con los filtros para usuarios.
        const resultados = await buscarUsuariosConFiltros(filtros);
        console.log("--- RESULTADO DE LA BÚSQUEDA FILTRADA DE USUARIOS ---");
        console.log(resultados);
        console.log("----------------------------------------------------");
      } catch (error) {
        console.error("Error al aplicar filtros de usuarios:", error);
      }
    } else if (tipoContenido === 'oficio') {
      try {
        // Llamamos a la función del servicio con los filtros para publicaciones.
        const resultados = await buscarPublicacionesConFiltros(filtros);
        console.log("--- RESULTADO DE LA BÚSQUEDA FILTRADA DE PUBLICACIONES ---");
        console.log(resultados);
        console.log("---------------------------------------------------------");
      } catch (error) {
        console.error("Error al aplicar filtros de publicaciones:", error);
      }
    } else {
      console.log("Filtro no aplicado: Por favor, selecciona un tipo de contenido.");
    }
  };

  // --- EFECTO PARA CARGAR DATOS DE FILTROS AL MONTAR ---
  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        // Peticiones en paralelo para eficiencia
        const [regionesData, comunasData] = await Promise.all([
          getAllRegions(),
          getAllComunas()
        ]);
        if (Array.isArray(regionesData)) setRegiones(regionesData);
        if (Array.isArray(comunasData)) setComunas(comunasData);
      } catch (error) {
        console.error("Error al cargar datos para filtros:", error);
      }
    };
    cargarDatosFiltros();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // --- EFECTO PARA FILTRAR COMUNAS CUANDO CAMBIA LA REGIÓN ---
  useEffect(() => {
    if (regionSeleccionada) {
      const filtradas = comunas.filter(
        (comuna) => comuna.idRegion === parseInt(regionSeleccionada)
      );
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]); // Limpia las comunas si no hay región
    }
  }, [regionSeleccionada, comunas]); // Se ejecuta si cambia la región o las comunas

  // 2. Datos de ejemplo para la publicación
  const publicacionEjemplo = {
      "idPublicacion": 2,
      "idAutor": 3,
      "tituloPublicacion": "Guitarra Eléctrica Fender Stratocaster",
      "idRegion": 1,
      "nombreRegion": "Metropolitana",
      "idComuna": 1,
      "nombreComuna": "Puente Alto",
      "ubicacionPublicacion": "Santiago Centro, cerca de Metro U. de Chile",
      "descripcionPublicacion": "Vendo guitarra en excelente estado, poco uso. Incluye funda y correa. Ideal para rock y blues.",
      "cantidadLikes": 15
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
                  <select className="input-estilo" value={regionSeleccionada} onChange={handleRegionChange}>
                    <option value="">Selecciona una región</option>
                    {regiones.map((region) => (
                      <option key={region.idRegion} value={region.idRegion}>
                        {region.nombreRegion}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grupo-input">
                  <label>Comuna</label>
                  <select 
                    className="input-estilo" 
                    value={comunaSeleccionada} 
                    onChange={handleComunaChange}
                    disabled={!regionSeleccionada}
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunasFiltradas.map((comuna) => (
                      <option key={comuna.idComuna} value={comuna.idComuna}>
                        {comuna.nombreComuna}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grupo-input">
                  <label>Tipo de Contenido</label>
                  <select 
                    className="input-estilo" 
                    value={tipoContenido} 
                    onChange={(e) => setTipoContenido(e.target.value)}
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="oficio">Oficio / Servicio</option>
                    <option value="usuario">Usuario / Cliente</option>
                  </select>
                </div>

                <div className="grupo-input">
                  <label>Desde (Fecha)</label>
                  <input 
                    type="date" 
                    className="input-estilo" 
                    value={fechaDesde} 
                    onChange={(e) => setFechaDesde(e.target.value)} 
                  />
                </div>
                
                <button type="button" className="btn-aplicar-filtros" onClick={handleAplicarFiltros}>Aplicar Filtros</button>
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
        <p>Aquí se listarán las tarjetas o resultados de tu aplicación. A continuación un ejemplo:</p>

        {/* 3. Aquí usamos el nuevo componente con los datos de ejemplo */}
        <PublicacionCard publicacion={publicacionEjemplo} />
      </div>
    </div>
  );
}

export default PaginaHome;