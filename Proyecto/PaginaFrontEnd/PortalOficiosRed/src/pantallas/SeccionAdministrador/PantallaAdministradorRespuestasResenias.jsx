import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  listarTodasRespuestasReseniasFront,
  deleteRespuestaResenia,
} from '../../servicios/ApiPublicaciones/SeccionResenias/respuestasReseniasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorRespuestasResenias = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('respuestas-resenias');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const cargarRespuestas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await listarTodasRespuestasReseniasFront();
      setRespuestas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar respuestas de reseñas:', err);
      setError('No se pudieron cargar las respuestas de reseñas. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarRespuestas();
  }, [usuario, navigate, cargarRespuestas]);

  const respuestasFiltradas = respuestas.filter((r) => {
    if (!terminoBusqueda) return true;

    const nombreAutor = r.nombreDelAutor ? r.nombreDelAutor.toLowerCase() : '';
    const idResenia = r.idResenia ? String(r.idResenia) : '';
    const termino = terminoBusqueda.toLowerCase();

    return nombreAutor.includes(termino) || idResenia.includes(termino);
  });

  const handleEliminarRespuesta = async (idRespuestaResenia) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta respuesta de reseña? Esta acción no se puede deshacer.')) {
      try {
        await deleteRespuestaResenia(idRespuestaResenia, token);
        alert('Respuesta de reseña eliminada correctamente.');
        cargarRespuestas();
      } catch (err) {
        console.error('Error eliminando respuesta de reseña:', err);
        alert('Ocurrió un error al intentar eliminar la respuesta de reseña.');
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          &#10094; Salir del panel
        </button>
        <h1>Panel de Administración</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Tabla de Respuestas de Reseñas</h2>
            <p>Visualización en tiempo real de las respuestas de reseñas registradas en la plataforma.</p>

            <div className="admin-controles-tabla">
              <input
                type="text"
                className="admin-busqueda"
                placeholder="🔍 Buscar por autor o ID de reseña..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
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
                      <th>ID Respuesta</th>
                      <th>ID Reseña</th>
                      <th>Autor</th>
                      <th>Texto</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {respuestasFiltradas.map((r) => (
                      <tr key={r.idRespuestaResenia}>
                        <td>{r.idRespuestaResenia}</td>
                        <td>{r.idResenia}</td>
                        <td>{r.nombreDelAutor || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>
                          {r.textoRespuestaResenia
                            ? (r.textoRespuestaResenia.length > 80
                                ? `${r.textoRespuestaResenia.slice(0, 80)}...`
                                : r.textoRespuestaResenia)
                            : <span style={{ color: '#999' }}>Sin texto</span>}
                        </td>
                        <td>
                          {r.fechaCreacion
                            ? new Date(r.fechaCreacion).toLocaleDateString('es-CL')
                            : <span style={{ color: '#999' }}>N/A</span>}
                        </td>
                        <td>
                          <select
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'ver') navigate(`/admin/respuestas-resenias/${r.idRespuestaResenia}`);
                              if (e.target.value === 'eliminar') handleEliminarRespuesta(r.idRespuestaResenia);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="ver">👁️ Ver Respuesta</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {respuestasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center">No hay respuestas de reseñas registradas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PantallaAdministradorRespuestasResenias;