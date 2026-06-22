import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  listarTodasReseniasFront,
  deleteResenia,
} from '../../servicios/ApiPublicaciones/SeccionResenias/reseniasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorResenias = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [resenias, setResenias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('resenias');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const cargarResenias = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await listarTodasReseniasFront();
      setResenias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
      setError('No se pudieron cargar las reseñas. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarResenias();
  }, [usuario, navigate, cargarResenias]);

  const reseniasFiltradas = resenias.filter((r) => {
    if (!terminoBusqueda) return true;

    const nombreAutor = r.nombreAutor ? r.nombreAutor.toLowerCase() : '';
    const nombreUsuarioReseniado = r.nombreUsuarioReseniado
      ? r.nombreUsuarioReseniado.toLowerCase()
      : '';
    const termino = terminoBusqueda.toLowerCase();

    return (
      nombreAutor.includes(termino) ||
      nombreUsuarioReseniado.includes(termino)
    );
  });

  const handleEliminarResenia = async (idResenia) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.')) {
      try {
        await deleteResenia(idResenia, token);
        alert('Reseña eliminada correctamente.');
        cargarResenias();
      } catch (err) {
        console.error('Error eliminando reseña:', err);
        alert('Ocurrió un error al intentar eliminar la reseña.');
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
            <h2>Tabla de Reseñas</h2>
            <p>Visualización en tiempo real de las reseñas registradas en la plataforma.</p>

            <div className="admin-controles-tabla">
              <input
                type="text"
                className="admin-busqueda"
                placeholder="🔍 Buscar por autor o usuario reseñado..."
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
                      <th>ID</th>
                      <th>Autor</th>
                      <th>Usuario Reseñado</th>
                      <th>Calificación</th>
                      <th>Texto</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reseniasFiltradas.map((r) => (
                      <tr key={r.reseniaId}>
                        <td>{r.reseniaId}</td>
                        <td>{r.nombreAutor || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>{r.nombreUsuarioReseniado || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>{r.calificacion ?? <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>
                          {r.textoResenia
                            ? (r.textoResenia.length > 80
                                ? `${r.textoResenia.slice(0, 80)}...`
                                : r.textoResenia)
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
                              if (e.target.value === 'ver') navigate(`/admin/resenias/${r.reseniaId}`);
                              if (e.target.value === 'eliminar') handleEliminarResenia(r.reseniaId);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="ver">👁️ Ver Reseña</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {reseniasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No hay reseñas registradas.</td>
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

export default PantallaAdministradorResenias;