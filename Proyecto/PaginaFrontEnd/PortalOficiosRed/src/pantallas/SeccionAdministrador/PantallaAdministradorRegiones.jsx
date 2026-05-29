import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllRegions, deleteRegion } from '../../servicios/ApiUsuarios/TablasCategorias/regionService'; 
import FormularioEditarRegionAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioRegion/FormularioEditarRegionAdmin'; 
import FormularioCrearRegionAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioRegion/FormularioCrearRegionAdmin'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/formularioEditarUsuarioAdmin.css';

const PantallaAdministradorRegiones = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [regiones, setRegiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo, setMenuActivo] = useState('regiones');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [regionEditandoId, setRegionEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const cargarRegiones = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllRegions();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setRegiones(data || []);
      }
    } catch (err) {
      console.error("Error al cargar regiones:", err);
      setError("No se pudieron cargar las regiones. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarRegiones();
  }, [usuario, navigate, cargarRegiones]);

  const regionesFiltradas = regiones.filter((r) => {
    if (!terminoBusqueda) return true;
    return (r.nombreRegion || '').toLowerCase().includes(terminoBusqueda.toLowerCase());
  });

  const handleEliminarRegion = async (idRegion) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta región?")) {
      try {
        await deleteRegion(idRegion, token);
        alert("Región eliminada correctamente.");
        cargarRegiones();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar la región.");
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
          {menuActivo === 'regiones' && (
            <div className="admin-panel-usuarios">
              <h2>Tabla de Regiones</h2>
              <p>Visualización de las regiones registradas en el sistema.</p>
              
              <div className="admin-controles-tabla">
                <input 
                  type="text" 
                  className="admin-busqueda" 
                  placeholder="🔍 Buscar región por nombre..." 
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
                <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                  + Crear Región
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
                        <th>ID Región</th>
                        <th>Nombre Región</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regionesFiltradas.map(r => (
                        <tr key={r.idRegion}>
                          <td>{r.idRegion}</td>
                          <td>{r.nombreRegion}</td>
                          <td>
                            <select 
                              className="admin-action-select"
                              value=""
                              onChange={(e) => {
                                if (e.target.value === 'editar') setRegionEditandoId(r.idRegion);
                                if (e.target.value === 'eliminar') handleEliminarRegion(r.idRegion);
                              }}
                            >
                              <option value="" disabled>Acciones...</option>
                              <option value="editar">✏️ Editar</option>
                              <option value="eliminar">🗑️ Eliminar</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {regionesFiltradas.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center">No hay regiones que coincidan con la búsqueda.</td>
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

      {regionEditandoId && (
        <FormularioEditarRegionAdmin 
          regionEdicionId={regionEditandoId} 
          onClose={() => setRegionEditandoId(null)} 
          onRefresh={cargarRegiones}
        />
      )}

      {mostrarModalCrear && (
        <FormularioCrearRegionAdmin 
          onClose={() => setMostrarModalCrear(false)} 
          onRefresh={cargarRegiones}
        />
      )}
    </div>
  );
};

export default PantallaAdministradorRegiones;