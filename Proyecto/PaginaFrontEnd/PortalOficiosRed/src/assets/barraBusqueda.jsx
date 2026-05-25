import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';
import '../style/assets/barraBusqueda.css'; // Importamos el CSS específico de la barra de búsqueda
import { getAllRegions } from '../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllOficios } from '../servicios/ApiUsuarios/TablasCategorias/oficioService'; // Importamos el servicio de oficios
import BarraLateral from './barrasLaterales/BarraLateral'; // 1. Importamos la nueva barra lateral
import logoOfired from './imagenes/imagenIcono.png'; // Importamos el logo de la aplicación

function BarraBusqueda() {
  const navigate = useNavigate();
  // Estado para controlar si el recuadro de filtros está abierto o cerrado
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // 2. Estado para controlar la visibilidad de la barra lateral
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState('');

  // --- ESTADOS PARA DATOS DE FILTROS ---
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [oficios, setOficios] = useState([]); // Nuevo estado para los oficios

  // --- ESTADOS PARA LA SELECCIÓN DEL USUARIO ---
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [oficioSeleccionado, setOficioSeleccionado] = useState(''); // Nuevo estado para la selección
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
  const manejarBusqueda = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!textoBusqueda.trim()) return; // Evita buscar si la barra está vacía

    const params = new URLSearchParams();
    params.append('q', textoBusqueda.trim());
    // Por defecto, la búsqueda por texto buscará oficios/publicaciones
    params.append('tipo', 'oficio');

    navigate(`/resultados?${params.toString()}`);
  };

  // Función que se ejecuta al presionar "Aplicar Filtros"
  const handleAplicarFiltros = () => {
    const params = new URLSearchParams();

    // Añadimos los parámetros solo si tienen valor
    if (tipoContenido) params.append('tipo', tipoContenido);//Se añade el tipo de contenido seleccionado al url
    if (regionSeleccionada) params.append('idRegion', regionSeleccionada); //Se añade la región seleccionada al url
    if (comunaSeleccionada) params.append('idComuna', comunaSeleccionada); //Se añade la comuna seleccionada al url
    if (oficioSeleccionado) params.append('idOficio', oficioSeleccionado); // Se añade el oficio al url
    if (fechaDesde) params.append('fecha', fechaDesde); //Se añade la fecha seleccionada al url

    // Navegamos a la página de resultados con los filtros como query params
    navigate(`/resultados?${params.toString()}`);
    setFiltrosAbiertos(false); // Cerramos el menú de filtros después de aplicar
  };

  // --- EFECTO PARA CARGAR DATOS DE FILTROS AL MONTAR ---
  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        // Peticiones en paralelo (Regiones, Comunas y Oficios) para eficiencia
        const [regionesData, comunasData, oficiosData] = await Promise.all([
          getAllRegions(),
          getAllComunas(),
          getAllOficios()
        ]);
        if (Array.isArray(regionesData)) setRegiones(regionesData);
        if (Array.isArray(comunasData)) setComunas(comunasData);
        if (Array.isArray(oficiosData)) setOficios(oficiosData);
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

  return (
    <nav 
      /* La clase "py-3" (padding vertical) en la siguiente línea es la que define el mayor largo/alto del navbar */
      className="navbar navbar-expand-md sticky-top shadow-sm px-3 py-3 navbar-principal" 
    >
      <div className="container-fluid">
        
        {/* Lado Izquierdo: LOGO Y NOMBRE */}
        <a className="navbar-brand d-flex align-items-center navbar-logo-link" onClick={() => navigate('/home')}>
          <img src={logoOfired} alt="Logo Ofired" width="45" height="45" className="me-2 rounded-circle shadow-sm bg-white p-1" />
          <span className="fw-bold text-dark fs-4">Ofired</span>
        </a>

        {/* Botón Toggler para dispositivos móviles (Menú hamburguesa) */}
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido" aria-controls="navbarContenido" aria-expanded="false" aria-label="Alternar navegación">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContenido">
          
          {/* Contenedor centralizado para poner Filtros y Búsqueda juntos */}
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center flex-grow-1 gap-2 mx-md-4 mt-3 mt-md-0">
            
            {/* Botón de Filtros y Dropdown */}
            <div className="position-relative">
              <button
                className="btn btn-light rounded-pill shadow-sm fw-bold px-4 py-3 fs-5 d-flex align-items-center gap-2"
                type="button"
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
              >
              <span>⚙️</span> Filtros
            </button>

            {/* Recuadro de Filtros estilo Bootstrap */}
            {filtrosAbiertos && (
              <div className="position-absolute bg-white shadow-lg p-4 rounded-4 border mt-2 navbar-filtros-dropdown">
                <h6 className="fw-bold mb-3 border-bottom pb-2">Opciones de Filtro</h6>
                <form>
                  <div className="mb-3 text-start">
                    <label className="form-label text-dark fw-semibold small mb-1">Región</label>
                    <select className="form-select shadow-sm" value={regionSeleccionada} onChange={handleRegionChange}>
                      <option value="">Selecciona una región</option>
                      {regiones.map((region) => (
                        <option key={region.idRegion} value={region.idRegion}>
                          {region.nombreRegion}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3 text-start">
                    <label className="form-label text-dark fw-semibold small mb-1">Comuna</label>
                    <select 
                      className="form-select shadow-sm" 
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

                  <div className="mb-3 text-start">
                    <label className="form-label text-dark fw-semibold small mb-1">Oficio</label>
                    <select 
                      className="form-select shadow-sm" 
                      value={oficioSeleccionado} 
                      onChange={(e) => setOficioSeleccionado(e.target.value)}
                    >
                      <option value="">Selecciona un oficio</option>
                      {oficios.map((oficio) => (
                        <option key={oficio.idOficio} value={oficio.idOficio}>
                          {oficio.nombreOficio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-dark fw-semibold small mb-1">Tipo de Contenido</label>
                    <select 
                      className="form-select shadow-sm" 
                      value={tipoContenido} 
                      onChange={(e) => setTipoContenido(e.target.value)}
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="oficio">Oficio / Servicio</option>
                      <option value="usuario">Usuario / Cliente</option>
                    </select>
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label text-dark fw-semibold small mb-1">Desde (Fecha)</label>
                    <input 
                      type="date" 
                      className="form-control shadow-sm" 
                      value={fechaDesde} 
                      onChange={(e) => setFechaDesde(e.target.value)} 
                    />
                  </div>
                  
                  <button type="button" className="btn btn-primary w-100 shadow-sm mt-2 fw-bold" onClick={handleAplicarFiltros}>Aplicar Filtros</button>
                </form>
              </div>
            )}
          </div>

            {/* Barra de Búsqueda con Lupa */}
            <form className="d-flex w-100 my-2 my-md-0 navbar-formulario-busqueda" onSubmit={manejarBusqueda}>
              <div className="input-group input-group-lg shadow rounded-pill overflow-hidden border bg-white w-100">
              <input
                className="form-control border-0 px-4 py-3 shadow-none fs-5"
                type="search"
                placeholder="Buscar oficios, profesionales, servicios..."
                aria-label="Buscar"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              <button className="btn btn-light border-0 px-4 bg-white text-secondary" type="submit" title="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </button>
              </div>
            </form>
          </div>

          {/* Lado Derecho: Botón para abrir la barra lateral */}
          <div className="d-flex ms-md-auto align-items-center mt-2 mt-md-0 pb-2 pb-md-0">
            <button 
              className="btn btn-light rounded-circle shadow d-flex justify-content-center align-items-center navbar-btn-usuario" 
              onClick={() => setSidebarAbierto(true)}
              title="Menú de usuario"
            >
              👤
            </button>
          </div>
        </div>
      </div>

      {/* El componente de la barra lateral que usa el Portal */}
      <BarraLateral abierta={sidebarAbierto} alCerrar={() => setSidebarAbierto(false)} />
    </nav>
  );
}

export default BarraBusqueda;