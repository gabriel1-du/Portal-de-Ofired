import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';
import { getAllRegions } from '../servicios/regionService';
import { getAllComunas } from '../servicios/comunasService';
import BarraLateral from './BarraLateral'; // 1. Importamos la nueva barra lateral

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
    if (fechaDesde) params.append('fecha', fechaDesde); //Se añade la fecha seleccionada al url

    // Navegamos a la página de resultados con los filtros como query params
    navigate(`/resultados?${params.toString()}`);
    setFiltrosAbiertos(false); // Cerramos el menú de filtros después de aplicar
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

  return (
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

      {/* Lado Derecho: Botón para abrir la barra lateral */}
      <div className="contenedor-usuario">
        <button 
          className="btn-usuario" 
          onClick={() => setSidebarAbierto(true)}
          title="Menú de usuario"
        >
          👤
        </button>
      </div>

      {/* 3. El componente de la barra lateral que usa el Portal */}
      <BarraLateral abierta={sidebarAbierto} alCerrar={() => setSidebarAbierto(false)} />
    </nav>
  );
}

export default BarraBusqueda;