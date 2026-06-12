import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllPublicaciones, deletePublicacion } from '../../servicios/ApiPublicaciones/publicacionesService'; 
import { getUsuarioById } from '../../servicios/usuariosService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css'; // Reutilizamos los mismos estilos

const PantallaAdministradorPublicaciones = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);
  
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo, setMenuActivo] = useState('publicaciones'); 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [autoresNombres, setAutoresNombres] = useState({});
  
  const cargarPublicaciones = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllPublicaciones();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setPublicaciones(data || []);
        
        // Obtener los nombres de los autores
        const uniqueAuthorIds = [...new Set((data || []).filter(p => p.idAutor).map(p => p.idAutor))];
        const nombresMap = {};
        await Promise.all(uniqueAuthorIds.map(async (id) => {
          try {
            const user = await getUsuarioById(id);
            nombresMap[id] = `${user.primerNombre || ''} ${user.primerApellido || ''}`.trim();
          } catch (err) {
            nombresMap[id] = 'Desconocido';
          }
        }));
        setAutoresNombres(nombresMap);
      }
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      setError("No se pudieron cargar las publicaciones. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Seguridad extra: expulsar a quien no sea administrador
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarPublicaciones();
  }, [usuario, navigate, cargarPublicaciones]);

  // Lógica para filtrar las publicaciones según el título
  const publicacionesFiltradas = publicaciones.filter((p) => {
    if (!terminoBusqueda) return true;
    const titulo = p.tituloPublicacion ? p.tituloPublicacion.toLowerCase() : '';
    return titulo.includes(terminoBusqueda.toLowerCase());
  });

  // Función para manejar la eliminación de una publicación
  const handleEliminarPublicacion = async (idPublicacion) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.")) {
      try {
        await deletePublicacion(idPublicacion, token);
        alert("Publicación eliminada correctamente.");
        cargarPublicaciones(); // Recargar la tabla automáticamente
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar la publicación.");
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      {/* Cabecera superior */}
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Salir del panel</button>
        <h1>Panel de Administración</h1>
      </header>

      <div className="admin-body">
        {/* Se le pasa el menú activo a la barra lateral para que ilumine la sección correcta */}
        <BarraLateralAdmin menuActivo={menuActivo} />

        {/* Contenido Principal Derecho (Tabla) */}
        <main className="admin-content-area">
          {menuActivo === 'publicaciones' && (
            <div className="admin-panel-usuarios">
              <h2>Tabla de Publicaciones</h2>
              <p>Visualización en tiempo real de los servicios y oficios registrados.</p>
              
              {/* Controles de la Tabla: Barra de Búsqueda */}
              <div className="admin-controles-tabla">
                <input 
                  type="text" 
                  className="admin-busqueda" 
                  placeholder="🔍 Buscar publicación por título..." 
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
                <button className="btn-crear-usuario" onClick={() => navigate('/crear-publicacion')}>
                  + Crear Publicación
                </button>
              </div>

              {cargando ? (
                <div className="admin-loading">Cargando base de datos...</div>
              ) : error ? (
                <div className="admin-error">{error}</div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Ubicación</th>
                        <th>Likes</th>
                        <th>Fecha Creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publicacionesFiltradas.map(p => (
                        <tr key={p.idPublicacion}>
                          <td>{p.idPublicacion}</td>
                          <td>{p.tituloPublicacion}</td>
                          <td>{autoresNombres[p.idAutor] ? `${autoresNombres[p.idAutor]} (ID: ${p.idAutor})` : `Cargando... (ID: ${p.idAutor})`}</td>
                          <td>{p.nombreComuna ? `${p.nombreComuna}, ${p.nombreRegion}` : <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>{p.cantidadLikes || 0}</td>
                          <td>{p.fechaPublicacion ? new Date(p.fechaPublicacion).toLocaleDateString('es-CL') : <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>
                            <select 
                              className="admin-action-select"
                              value=""
                              onChange={(e) => {
                                if (e.target.value === 'ver') navigate(`/publicacion/${p.idPublicacion}`);
                                if (e.target.value === 'eliminar') handleEliminarPublicacion(p.idPublicacion);
                              }}
                            >
                              <option value="" disabled>Acciones...</option>
                              <option value="ver">👁️ Ver Publicación</option>
                              <option value="eliminar">🗑️ Eliminar</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {publicacionesFiltradas.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No hay publicaciones registradas.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PantallaAdministradorPublicaciones;