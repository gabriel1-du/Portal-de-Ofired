import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BarraBusqueda from '../assets/barraBusqueda.jsx';
import UsuarioCard from '../assets/UsuarioCard.jsx';
import PublicacionCard from '../assets/PublicacionesCard.jsx';
import { buscarUsuariosConFiltros } from '../servicios/busquedaUsuarios.js';
import { buscarPublicacionesConFiltros } from '../servicios/busquedaPublicaciones.js';
import { getPublicacionesByNombre } from '../servicios/publicacionesService.js';
import '../style/ResultadosBusqueda.css';

function ResultadosBusqueda() {
  const [searchParams] = useSearchParams();
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
      
      // Determina el tipo de resultado a mostrar, por defecto 'usuario' si no se especifica.
      setTipoResultado(tipo || 'usuario');

      try {
        let data;
        // Si hay un parámetro 'q', es una búsqueda por texto.
        if (query) {
          data = await getPublicacionesByNombre(query);
          setTipoResultado('oficio'); // La búsqueda por texto es para oficios/publicaciones
        } else {
          // Si no, es una búsqueda por filtros.
          const filtros = {
            idRegion: searchParams.get('idRegion'),
            idComuna: searchParams.get('idComuna'),
            fecha: searchParams.get('fecha'),
          };
          // Limpia los filtros que no tienen valor.
          Object.keys(filtros).forEach(key => (filtros[key] === null || filtros[key] === '') && delete filtros[key]);

          if (tipo === 'usuario') {
            data = await buscarUsuariosConFiltros(filtros);
          } else if (tipo === 'oficio') {
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
          throw new Error('La búsqueda no devolvió un formato de resultados válido.');
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

  const renderResultados = () => {
    if (cargando) return <p>Buscando...</p>;
    if (error) return <p className="error-mensaje">Error: {error}</p>;
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
          <button className={`btn-tipo ${tipoResultado === 'usuario' ? 'activo' : ''}`}>Usuarios</button>
          <button className={`btn-tipo ${tipoResultado === 'oficio' ? 'activo' : ''}`}>Publicaciones</button>
        </div>

        <div className="resultados-contenedor">
          {renderResultados()}
        </div>
      </div>
    </div>
  );
}

export default ResultadosBusqueda;

