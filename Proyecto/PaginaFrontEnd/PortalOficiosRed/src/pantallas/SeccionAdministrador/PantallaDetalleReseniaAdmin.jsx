import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  obtenerReseniaPorId,
  deleteResenia,
} from '../../servicios/ApiPublicaciones/SeccionResenias/reseniasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaDetalleReseniaAdmin = () => {
  const navigate = useNavigate();
  const { idResenia } = useParams();
  const { usuario, token } = useContext(AuthContext);

  const [resenia, setResenia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('resenias');

  const cargarResenia = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerReseniaPorId(idResenia);
      setResenia(data);
    } catch (err) {
      console.error('Error al cargar la reseña:', err);
      setError('No se pudo cargar la reseña solicitada.');
    } finally {
      setCargando(false);
    }
  }, [idResenia]);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarResenia();
  }, [usuario, navigate, cargarResenia]);

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.')) {
      try {
        await deleteResenia(idResenia, token);
        alert('Reseña eliminada correctamente.');
        navigate('/admin/resenias');
      } catch (err) {
        console.error('Error eliminando reseña:', err);
        alert('Ocurrió un error al intentar eliminar la reseña.');
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate('/admin/resenias')}>
          &#10094; Volver a reseñas
        </button>
        <h1>Detalle de Reseña</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Reseña #{idResenia}</h2>
            <p>Visualización detallada de la reseña seleccionada.</p>

            {cargando ? (
              <div className="admin-loading">Cargando reseña...</div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : !resenia ? (
              <div className="admin-error">No se encontró la reseña.</div>
            ) : (
              <div className="table-responsive" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><strong>ID Reseña:</strong> {resenia.idResenia}</div>
                  <div><strong>ID Autor:</strong> {resenia.idAutor}</div>
                  <div><strong>ID Usuario Reseñado:</strong> {resenia.idUsuarioReseniado}</div>
                  <div><strong>Calificación:</strong> {resenia.calificacion}</div>
                  <div>
                    <strong>Fecha Creación:</strong>{' '}
                    {resenia.fechaCreacion
                      ? new Date(resenia.fechaCreacion).toLocaleString('es-CL')
                      : 'N/A'}
                  </div>
                  <div>
                    <strong>Texto de la reseña:</strong>
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                      }}
                    >
                      {resenia.textoResenia || 'Sin contenido'}
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-crear-usuario" onClick={() => navigate('/admin/resenias')}>
                      Volver al listado
                    </button>
                    <button
                      className="btn-crear-usuario"
                      onClick={handleEliminar}
                      style={{ backgroundColor: '#d32f2f' }}
                    >
                      Eliminar reseña
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PantallaDetalleReseniaAdmin;