import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  listarDenuncias,
  eliminarDenuncia,
} from '../../servicios/ApiUsuarios/DenunciarUsuario/denunciasService';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorDenuncias = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('denuncias');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const cargarDenuncias = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await listarDenuncias();
      setDenuncias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar denuncias:', err);
      setError('No se pudieron cargar las denuncias. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarDenuncias();
  }, [usuario, navigate, cargarDenuncias]);

  const denunciasFiltradas = denuncias.filter((d) => {
    if (!terminoBusqueda) return true;

    const denunciante = d.nombreUsuarioDenunciante ? d.nombreUsuarioDenunciante.toLowerCase() : '';
    const denunciado = d.nombreUsuarioDenunciado ? d.nombreUsuarioDenunciado.toLowerCase() : '';
    const tipoDenuncia = d.nombreTipoDenuncia ? d.nombreTipoDenuncia.toLowerCase() : '';
    const tipoContenido = d.nombreTipoContenido ? d.nombreTipoContenido.toLowerCase() : '';
    const termino = terminoBusqueda.toLowerCase();

    return (
      denunciante.includes(termino) ||
      denunciado.includes(termino) ||
      tipoDenuncia.includes(termino) ||
      tipoContenido.includes(termino)
    );
  });

  const handleEliminarDenuncia = async (idDenuncia) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta denuncia? Esta acción no se puede deshacer.')) {
      try {
        await eliminarDenuncia(idDenuncia, token);
        alert('Denuncia eliminada correctamente.');
        cargarDenuncias();
      } catch (err) {
        console.error('Error eliminando denuncia:', err);
        alert('Ocurrió un error al intentar eliminar la denuncia.');
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
            <h2>Tabla de Denuncias</h2>
            <p>Visualización en tiempo real de las denuncias registradas en la plataforma.</p>

            <div className="admin-controles-tabla">
              <input
                type="text"
                className="admin-busqueda"
                placeholder="🔍 Buscar por denunciante, denunciado o tipo..."
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
                      <th>Usuario Denunciante</th>
                      <th>Tipo Denuncia</th>
                      <th>Tipo Contenido</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Usuario Denunciado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denunciasFiltradas.map((d) => (
                      <tr key={d.idDenuncia}>
                        <td>{d.idDenuncia}</td>
                        <td>{d.nombreUsuarioDenunciante || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>{d.nombreTipoDenuncia || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>{d.nombreTipoContenido || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>
                          {d.descripcionDenuncia
                            ? (d.descripcionDenuncia.length > 80
                                ? `${d.descripcionDenuncia.slice(0, 80)}...`
                                : d.descripcionDenuncia)
                            : <span style={{ color: '#999' }}>Sin descripción</span>}
                        </td>
                        <td>
                          {d.fechaDenuncia
                            ? new Date(d.fechaDenuncia).toLocaleDateString('es-CL')
                            : <span style={{ color: '#999' }}>N/A</span>}
                        </td>
                        <td>{d.nombreUsuarioDenunciado || <span style={{ color: '#999' }}>N/A</span>}</td>
                        <td>
                          <select
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'ver') navigate(`/admin/denuncias/${d.idDenuncia}`);
                              if (e.target.value === 'eliminar') handleEliminarDenuncia(d.idDenuncia);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="ver">👁️ Ver Denuncia</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {denunciasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center">No hay denuncias registradas.</td>
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

export default PantallaAdministradorDenuncias;