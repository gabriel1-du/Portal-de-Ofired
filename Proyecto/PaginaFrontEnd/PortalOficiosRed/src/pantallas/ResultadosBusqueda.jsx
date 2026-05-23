import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BarraBusqueda from '../assets/barraBusqueda.jsx';
import UsuarioCard from '../assets/UsuarioCard.jsx';
import PublicacionCard from '../assets/PublicacionesCard.jsx';
import { buscarUsuariosConFiltros } from '../servicios/busquedaUsuarios.js';
import { buscarPublicacionesConFiltros } from '../servicios/busquedaPublicaciones.js';
import { getPublicacionesByNombre } from '../servicios/publicacionesService.js';
import { buscarUsuariosPorNombre } from '../servicios/usuariosService.js';
import '../style/ResultadosBusqueda.css';

function ResultadosBusqueda() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [tipoResultado, setTipoResultado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ejecutarBusqueda = async () => {
      setCargando(true);
      setError(null);
      setResultados([]);

      const tipo = searchParams.get('tipo');
      const query = searchParams.get('q');
      
      // Determina el tipo de resultado a mostrar, por defecto 'usuario'.
      const tipoSeleccionado = tipo || 'usuario';
      setTipoResultado(tipoSeleccionado);

      try {
        let data;
        // Si hay un parámetro 'q', es una búsqueda por texto.
        if (query) { 
          if (tipoSeleccionado === 'usuario') {
            data = await buscarUsuariosPorNombre(query);
          } else {
            data = await getPublicacionesByNombre(query);
          }
        } else {
          // Si no, es una búsqueda por filtros.
          const filtros = {
            idRegion: searchParams.get('idRegion'),
            idComuna: searchParams.get('idComuna'),
            fecha: searchParams.get('fecha'),
          };
          // Limpia los filtros que no tienen valor.
          Object.keys(filtros).forEach(key => (filtros[key] === null || filtros[key] === '') && delete filtros[key]);

          if (tipoSeleccionado === 'usuario') {
            data = await buscarUsuariosConFiltros(filtros);
          } else if (tipoSeleccionado === 'oficio') {
            data = await buscarPublicacionesConFiltros(filtros);
          } else {
            // Si no hay tipo, podríamos no buscar nada o tener un default.
            // Por ahora, no hacemos nada si no hay tipo ni query.
            data = [];
          }
        }

        if (Array.isArray(data)) {
          setResultados(data);
        } else {
          throw new Error('Error en la busqueda');
        }
      } catch (err) {
        console.error("Error al ejecutar la búsqueda:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    ejecutarBusqueda();
  }, [searchParams]); // El efecto se ejecuta cada vez que los parámetros de la URL cambian.

  // Permite alternar entre buscar Usuarios y Publicaciones sin recargar la página entera
  const cambiarTipo = (nuevoTipo) => {
    const params = new URLSearchParams(searchParams);
    params.set('tipo', nuevoTipo);
    navigate(`/resultados?${params.toString()}`);
  };

  const renderResultados = () => {
    if (cargando) return <p>Buscando...</p>;
    if (error) return (
      <div className="error-mensaje">
        <h4>¡Ups! Algo salió mal con la búsqueda </h4>
        <p>Por favor, intenta buscar con otros términos o recarga la página más tarde.</p>
        <small>(Detalle técnico: {error})</small>
      </div>
    );
    if (resultados.length === 0) return <p>No se encontraron resultados para tu búsqueda.</p>;

    const resultadosAMostrar = resultados.slice(0, 5);

    if (tipoResultado === 'usuario') {
      return resultadosAMostrar.map(usuario => <UsuarioCard key={usuario.idUsuario} usuario={usuario} />);
    }
    if (tipoResultado === 'oficio') {
      return resultadosAMostrar.map(publicacion => <PublicacionCard key={publicacion.idPublicacion} publicacion={publicacion} />);
    }
    return null;
  };

  return (
    <div>
      <BarraBusqueda />

      <div className="container mt-4">
        <div className="botones-tipo-resultado">
          <button className={`btn-tipo ${tipoResultado === 'usuario' ? 'activo' : ''}`} onClick={() => cambiarTipo('usuario')}>Usuarios</button>
          <button className={`btn-tipo ${tipoResultado === 'oficio' ? 'activo' : ''}`} onClick={() => cambiarTipo('oficio')}>Publicaciones</button>
        </div>

        <div className="resultados-contenedor">
          {renderResultados()}
        </div>
      </div>
    </div>
  );
}

export default ResultadosBusqueda;
