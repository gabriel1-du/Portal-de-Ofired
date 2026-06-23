import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  listarTodasRespuestasReseniasFront,
  deleteRespuestaResenia,
} from '../../servicios/ApiPublicaciones/SeccionResenias/respuestasReseniasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaDetalleRespuestaReseniaAdmin = () => {
  const navigate = useNavigate();
  const { idRespuestaResenia } = useParams();
  const { usuario, token } = useContext(AuthContext);

  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('respuestas-resenias');

  const cargarRespuesta = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await listarTodasRespuestasReseniasFront();
      const respuestaEncontrada = (Array.isArray(data) ? data : []).find(
        (item) => String(item.idRespuestaResenia) === String(idRespuestaResenia)
      );

      setRespuesta(respuestaEncontrada || null);
    } catch (err) {
      console.error('Error al cargar la respuesta de reseña:', err);
      setError('No se pudo cargar la respuesta de reseña solicitada.');
    } finally {
      setCargando(false);
    }
  }, [idRespuestaResenia]);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarRespuesta();
  }, [usuario, navigate, cargarRespuesta]);

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta respuesta de reseña? Esta acción no se puede deshacer.')) {
      try {
        await deleteRespuestaResenia(idRespuestaResenia, token);
        alert('Respuesta de reseña eliminada correctamente.');
        navigate('/admin/respuestas-resenias');
      } catch (err) {
        console.error('Error eliminando respuesta de reseña:', err);
        alert('Ocurrió un error al intentar eliminar la respuesta de reseña.');
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate('/admin/respuestas-resenias')}>
          &#10094; Volver a respuestas de reseñas
        </button>
        <h1>Detalle de Respuesta de Reseña</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Respuesta de Reseña #{idRespuestaResenia}</h2>
            <p>Visualización detallada de la respuesta seleccionada.</p>

            {cargando ? (
              <div className="admin-loading">Cargando respuesta...</div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : !respuesta ? (
              <div className="admin-error">No se encontró la respuesta de reseña.</div>
            ) : (
              <div className="table-responsive" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><strong>ID Respuesta:</strong> {respuesta.idRespuestaResenia}</div>
                  <div><strong>ID Reseña:</strong> {respuesta.idResenia}</div>
                  <div><strong>Autor:</strong> {respuesta.nombreDelAutor || 'N/A'}</div>
                  <div>
                    <strong>Fecha Creación:</strong>{' '}
                    {respuesta.fechaCreacion
                      ? new Date(respuesta.fechaCreacion).toLocaleString('es-CL')
                      : 'N/A'}
                  </div>
                  <div>
                    <strong>Texto de la respuesta:</strong>
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
                      {respuesta.textoRespuestaResenia || 'Sin contenido'}
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-crear-usuario" onClick={() => navigate('/admin/respuestas-resenias')}>
                      Volver al listado
                    </button>
                    <button
                      className="btn-crear-usuario"
                      onClick={handleEliminar}
                      style={{ backgroundColor: '#d32f2f' }}
                    >
                      Eliminar respuesta
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

export default PantallaDetalleRespuestaReseniaAdmin;