import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllSexos, deleteSexo } from '../../servicios/ApiUsuarios/TablasCategorias/sexoService'; 
import FormularioEditarSexoAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioSexo/FormularioEditarSexoAdmin'; 
import FormularioCrearSexoAdmin from './FormulariosAdmisnitrador/Fromulario/FormularioSexo/FormularioCrearSexoAdmin'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorSexos = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [sexos, setSexos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('sexos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [sexoEditandoId, setSexoEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const cargarSexos = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllSexos();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setSexos(data || []);
      }
    } catch (err) {
      console.error("Error al cargar sexos:", err);
      setError("No se pudieron cargar los sexos. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarSexos();
  }, [usuario, navigate, cargarSexos]);

  const sexosFiltrados = sexos.filter((s) => {
    if (!terminoBusqueda) return true;
    return (s.nombreSexo || '').toLowerCase().includes(terminoBusqueda.toLowerCase());
  });

  const handleEliminarSexo = async (idSexo) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        await deleteSexo(idSexo, token);
        alert("Registro eliminado correctamente.");
        cargarSexos();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar el registro.");
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
            <h2>Tabla de Sexos</h2>
            <p>Visualización de los géneros/sexos registrados en el sistema.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar por nombre..." 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                + Crear Sexo
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
                      <th>ID Sexo</th>
                      <th>Nombre Sexo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sexosFiltrados.map(s => (
                      <tr key={s.idSexo}>
                        <td>{s.idSexo}</td>
                        <td>{s.nombreSexo}</td>
                        <td>
                          <select 
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'editar') setSexoEditandoId(s.idSexo);
                              if (e.target.value === 'eliminar') handleEliminarSexo(s.idSexo);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="editar">✏️ Editar</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {sexosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">No hay registros que coincidan con la búsqueda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {sexoEditandoId && <FormularioEditarSexoAdmin sexoEdicionId={sexoEditandoId} onClose={() => setSexoEditandoId(null)} onRefresh={cargarSexos} />}
      {mostrarModalCrear && <FormularioCrearSexoAdmin onClose={() => setMostrarModalCrear(false)} onRefresh={cargarSexos} />}
    </div>
  );
};

export default PantallaAdministradorSexos;