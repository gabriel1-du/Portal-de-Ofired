import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  obtenerDenunciaPorId,
  eliminarDenuncia,
} from '../../servicios/ApiUsuarios/DenunciarUsuario/denunciasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaDetalleDenunciaAdmin = () => {
  const navigate = useNavigate();
  const { idDenuncia } = useParams();
  const { usuario, token } = useContext(AuthContext);

  const [denuncia, setDenuncia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('denuncias');

  const cargarDenuncia = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerDenunciaPorId(idDenuncia);
      setDenuncia(data);
    } catch (err) {
      console.error('Error al cargar la denuncia:', err);
      setError('No se pudo cargar la denuncia solicitada.');
    } finally {
      setCargando(false);
    }
  }, [idDenuncia]);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarDenuncia();
  }, [usuario, navigate, cargarDenuncia]);

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta denuncia? Esta acción no se puede deshacer.')) {
      try {
        await eliminarDenuncia(idDenuncia, token);
        alert('Denuncia eliminada correctamente.');
        navigate('/admin/denuncias');
      } catch (err) {
        console.error('Error eliminando denuncia:', err);
        alert('Ocurrió un error al intentar eliminar la denuncia.');
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate('/admin/denuncias')}>
          &#10094; Volver a denuncias
        </button>
        <h1>Detalle de Denuncia</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Denuncia #{idDenuncia}</h2>
            <p>Visualización detallada de la denuncia seleccionada.</p>

            {cargando ? (
              <div className="admin-loading">Cargando denuncia...</div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : !denuncia ? (
              <div className="admin-error">No se encontró la denuncia.</div>
            ) : (
              <div className="table-responsive" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><strong>ID Denuncia:</strong> {denuncia.idDenuncia}</div>
                  <div><strong>Usuario Denunciante:</strong> {denuncia.nombreUsuarioDenunciante || 'N/A'}</div>
                  <div><strong>Tipo Denuncia:</strong> {denuncia.nombreTipoDenuncia || 'N/A'}</div>
                  <div><strong>Tipo Contenido:</strong> {denuncia.nombreTipoContenido || 'N/A'}</div>
                  <div><strong>Usuario Denunciado:</strong> {denuncia.nombreUsuarioDenunciado || 'N/A'}</div>
                  <div>
                    <strong>Fecha Denuncia:</strong>{' '}
                    {denuncia.fechaDenuncia
                      ? new Date(denuncia.fechaDenuncia).toLocaleString('es-CL')
                      : 'N/A'}
                  </div>
                  <div><strong>ID Publicación Denunciada:</strong> {denuncia.idPublicacionDenunciada ?? 'N/A'}</div>
                  <div><strong>ID Reseña Denunciada:</strong> {denuncia.idReseniaDenunciada ?? 'N/A'}</div>
                  <div><strong>ID Respuesta Denunciada:</strong> {denuncia.idRespuestaDenunciada ?? 'N/A'}</div>
                  <div>
                    <strong>Descripción de la denuncia:</strong>
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
                      {denuncia.descripcionDenuncia || 'Sin contenido'}
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-crear-usuario" onClick={() => navigate('/admin/denuncias')}>
                      Volver al listado
                    </button>
                    <button
                      className="btn-crear-usuario"
                      onClick={handleEliminar}
                      style={{ backgroundColor: '#d32f2f' }}
                    >
                      Eliminar denuncia
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

export default PantallaDetalleDenunciaAdmin;