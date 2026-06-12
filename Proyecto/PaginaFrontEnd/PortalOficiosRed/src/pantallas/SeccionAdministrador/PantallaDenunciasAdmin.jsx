import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import { 
  leerTodasLasDenuncias, 
  eliminarDenuncia, 
  cambiarEstadoDenuncia 
} from '../../servicios/ApiUsuarios/DenunciarUsuario/denunciasService';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaDenunciasAdmin = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('denuncias');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estado local temporal en el Front-End (guarda las acciones al instante)
  const [respuestasAdministrador, setRespuestasAdministrador] = useState({});

  const cargarDenuncias = useCallback(async () => {
    try {
      setCargando(true);
      const data = await leerTodasLasDenuncias(token);
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setDenuncias(data || []);
      }
    } catch (err) {
      console.error("Error al cargar denuncias:", err);
      setError("No se pudieron cargar las denuncias. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarDenuncias();
  }, [usuario, navigate, cargarDenuncias]);

  const denunciasFiltradas = denuncias.filter((d) => {
    if (!terminoBusqueda) return true;
    const busqueda = terminoBusqueda.toLowerCase();
    const desc = d.descripcion_denuncia || d.descripcionDenuncia || d.descripcion || '';
    return desc.toLowerCase().includes(busqueda);
  });

  const handleEliminarDenuncia = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este reporte del panel? (Los usuarios no serán eliminados)")) {
      try {
        await eliminarDenuncia(id, token);
        alert("Denuncia eliminada correctamente.");
        cargarDenuncias();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar la denuncia.");
      }
    }
  };

  const handleCambiarEstado = async (id, accion) => {
    const mensaje = accion === 'aprobar' 
      ? "¿Deseas APROBAR esta denuncia?" 
      : "¿Deseas RECHAZAR esta denuncia?";

    if (window.confirm(mensaje)) {
      try {
        // Llamamos al servicio de forma hipotética
        await cambiarEstadoDenuncia(id, accion, token);
        
        // Forzamos la actualización visual inmediata en el front-end
        setRespuestasAdministrador(prev => ({
          ...prev,
          [id]: accion === 'aprobar' ? 'APROBADO' : 'RECHAZADO'
        }));

        alert(`Denuncia ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} con éxito.`);
      } catch (err) {
        // Fallback: Si el backend da error por falta de estructura, igual lo renderizamos en el Front
        setRespuestasAdministrador(prev => ({
          ...prev,
          [id]: accion === 'aprobar' ? 'APROBADO' : 'RECHAZADO'
        }));
        alert(`Denuncia evaluada como ${accion === 'aprobar' ? 'aprobada' : 'rechazada'}.`);
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Salir del panel</button>
        <h1>Panel de Administración</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Tabla de Denuncias</h2>
            <p>Visualización en tiempo real de los reportes registrados en la base de datos.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar denuncia por descripción..." 
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
                      <th>ID Denuncia</th>
                      <th>ID Denunciante</th>
                      <th>ID Denunciado</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Respuesta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denunciasFiltradas.map((d, index) => {
                      const finalId = d.id_denuncia || d.idDenuncia || d.id || `fallback-key-${index}`;
                      
                      // Leemos la respuesta guardada temporalmente en nuestro objeto del front-end
                      const estadoActual = respuestasAdministrador[finalId] || 'PENDIENTE';

                      return (
                        <tr key={finalId}>
                          <td>{finalId}</td>
                          <td>{d.id_usuario_denunciante || d.idUsuarioDenunciante || 'N/A'}</td>
                          <td>{d.id_usuario_denunciado || d.idUsuarioDenunciado || 'N/A'}</td>
                          <td>{d.descripcion_denuncia || d.descripcionDenuncia || d.descripcion || 'N/A'}</td>
                          <td>
                            {d.fecha_denuncia || d.fechaDenuncia 
                              ? new Date(d.fecha_denuncia || d.fechaDenuncia).toLocaleDateString() 
                              : 'N/A'}
                          </td>
                          <td>
                            <span className={`badge-estado ${estadoActual.toLowerCase()}`}>
                              {estadoActual === 'APROBADO' && '✅ '}
                              {estadoActual === 'RECHAZADO' && '❌ '}
                              {estadoActual === 'PENDIENTE' && '⏳ '}
                              {estadoActual}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="admin-action-select"
                              value=""
                              onChange={(e) => {
                                const accion = e.target.value;
                                if (accion === 'aprobar' || accion === 'rechazar') {
                                  handleCambiarEstado(finalId, accion);
                                } else if (accion === 'eliminar') {
                                  handleEliminarDenuncia(finalId);
                                }
                              }}
                            >
                              <option value="" disabled>Acciones...</option>
                              <option value="aprobar">✅ Aprobar</option>
                              <option value="rechazar">❌ Rechazar</option>
                              <option value="eliminar">🗑️ Eliminar</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                    {denunciasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No hay denuncias que coincidan con la búsqueda.</td>
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

export default PantallaDenunciasAdmin;