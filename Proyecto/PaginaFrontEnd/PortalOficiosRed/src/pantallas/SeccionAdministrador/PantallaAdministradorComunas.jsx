import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllComunas, deleteComuna } from '../../servicios/ApiUsuarios/TablasCategorias/comunasService'; 
import FormularioEditarComunaAdmin from './FormulariosAdmisnitrador/Fromulario/FomrularioComuna/FormularioEditarComunaAdmin'; 
import FormularioCrearComunaAdmin from './FormulariosAdmisnitrador/Fromulario/FomrularioComuna/FormularioCrearComunaAdmin'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorComunas = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [comunas, setComunas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('comunas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [comunaEditandoId, setComunaEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const cargarComunas = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllComunas();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setComunas(data || []);
      }
    } catch (err) {
      console.error("Error al cargar comunas:", err);
      setError("No se pudieron cargar las comunas. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarComunas();
  }, [usuario, navigate, cargarComunas]);

  const comunasFiltradas = comunas.filter((c) => {
    if (!terminoBusqueda) return true;
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      (c.nombreComuna || '').toLowerCase().includes(busqueda) || 
      (c.nombreRegion || '').toLowerCase().includes(busqueda)
    );
  });

  const handleEliminarComuna = async (idComuna) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta comuna?")) {
      try {
        await deleteComuna(idComuna, token);
        alert("Comuna eliminada correctamente.");
        cargarComunas();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar la comuna.");
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
            <h2>Tabla de Comunas</h2>
            <p>Visualización de las comunas registradas y sus regiones asociadas en el sistema.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar comuna o región..." 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                + Crear Comuna
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
                      <th>ID Comuna</th>
                      <th>Nombre Comuna</th>
                      <th>Región Perteneciente</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comunasFiltradas.map(c => (
                      <tr key={c.idComuna}>
                        <td>{c.idComuna}</td>
                        <td>{c.nombreComuna}</td>
                        <td>{c.nombreRegion || `ID: ${c.idRegion}`}</td>
                        <td>
                          <select 
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'editar') setComunaEditandoId(c.idComuna);
                              if (e.target.value === 'eliminar') handleEliminarComuna(c.idComuna);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="editar">✏️ Editar</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {comunasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center">No hay comunas que coincidan con la búsqueda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {comunaEditandoId && (
        <FormularioEditarComunaAdmin 
          comunaEdicionId={comunaEditandoId} 
          onClose={() => setComunaEditandoId(null)} 
          onRefresh={cargarComunas}
        />
      )}

      {mostrarModalCrear && (
        <FormularioCrearComunaAdmin 
          onClose={() => setMostrarModalCrear(false)} 
          onRefresh={cargarComunas}
        />
      )}
    </div>
  );
};

export default PantallaAdministradorComunas;