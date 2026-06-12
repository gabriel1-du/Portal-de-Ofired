import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllOficios, deleteOficio } from '../../servicios/ApiUsuarios/TablasCategorias/oficioService'; 
import FormularioEditarOficioAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioOficio/FormularioEditarOficioAdmin'; 
import FormularioCrearOficioAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioOficio/FormularioCrearOficioAdmin'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorOficios = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [oficios, setOficios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('oficios');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [oficioEditandoId, setOficioEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const cargarOficios = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllOficios();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setOficios(data || []);
      }
    } catch (err) {
      console.error("Error al cargar oficios:", err);
      setError("No se pudieron cargar los oficios. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarOficios();
  }, [usuario, navigate, cargarOficios]);

  const oficiosFiltrados = oficios.filter((o) => {
    if (!terminoBusqueda) return true;
    return (o.nombreOficio || '').toLowerCase().includes(terminoBusqueda.toLowerCase());
  });

  const handleEliminarOficio = async (idOficio) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este oficio?")) {
      try {
        await deleteOficio(idOficio, token);
        alert("Oficio eliminado correctamente.");
        cargarOficios();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar el oficio.");
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
            <h2>Tabla de Oficios</h2>
            <p>Visualización de los oficios y servicios profesionales registrados en el sistema.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar oficio por nombre..." 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                + Crear Oficio
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
                      <th>ID Oficio</th>
                      <th>Nombre Oficio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oficiosFiltrados.map(o => (
                      <tr key={o.idOficio}>
                        <td>{o.idOficio}</td>
                        <td>{o.nombreOficio}</td>
                        <td>
                          <select 
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'editar') setOficioEditandoId(o.idOficio);
                              if (e.target.value === 'eliminar') handleEliminarOficio(o.idOficio);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="editar">✏️ Editar</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {oficiosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">No hay oficios que coincidan con la búsqueda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {oficioEditandoId && <FormularioEditarOficioAdmin oficioEdicionId={oficioEditandoId} onClose={() => setOficioEditandoId(null)} onRefresh={cargarOficios} />}
      {mostrarModalCrear && <FormularioCrearOficioAdmin onClose={() => setMostrarModalCrear(false)} onRefresh={cargarOficios} />}
    </div>
  );
};

export default PantallaAdministradorOficios;