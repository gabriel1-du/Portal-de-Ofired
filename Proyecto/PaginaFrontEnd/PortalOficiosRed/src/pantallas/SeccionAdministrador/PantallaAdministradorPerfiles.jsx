import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllPerfiles } from '../../servicios/ApiUsuarios/perfilesUsuarioService'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorPerfiles = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('perfiles'); 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const cargarPerfiles = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getAllPerfiles();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setPerfiles(data || []);
      }
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
      setError("No se pudieron cargar los perfiles. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarPerfiles();
  }, [usuario, navigate, cargarPerfiles]);

  // Filtrado
  const perfilesFiltrados = perfiles.filter((p) => {
    if (!terminoBusqueda) return true;
    const nombreCompleto = `${p.primerNombre || ''} ${p.segundoNombre || ''} ${p.primerApellido || ''} ${p.segundoApellido || ''}`.trim().toLowerCase();
    const apodo = (p.nombreApodo || '').toLowerCase();
    return nombreCompleto.includes(terminoBusqueda.toLowerCase()) || apodo.includes(terminoBusqueda.toLowerCase());
  });

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
            <h2>Tabla de Perfiles</h2>
            <p>Visualización de los perfiles públicos registrados y sus valoraciones.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar por nombre o apodo..." 
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
                      <th>ID Perfil</th>
                      <th>Apodo</th>
                      <th>Nombre Completo</th>
                      <th>Correo</th>
                      <th>Oficio</th>
                      <th>Ubicación</th>
                      <th>Calificación</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfilesFiltrados.map(p => {
                      // UNIFICAMOS EL NOMBRE COMPLETO
                      const nombreCompleto = `${p.primerNombre || ''} ${p.segundoNombre || ''} ${p.primerApellido || ''} ${p.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
                      
                      return (
                        <tr key={p.idPerfilUsuario}>
                          <td>{p.idPerfilUsuario}</td>
                          <td>{p.nombreApodo || <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>{nombreCompleto}</td>
                          <td>{p.correoElec}</td>
                          <td>{p.nombreOficio || <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>{p.nombreComuna ? `${p.nombreComuna}, ${p.nombreRegion}` : <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>{p.calificacion || 0}</td>
                          <td>{p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-CL') : <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>
                            <select 
                              className="admin-action-select"
                              value=""
                              onChange={(e) => {
                                if (e.target.value === 'ver') navigate(`/perfil/${p.idUsuario}`);
                                if (e.target.value === 'acciones') {
                                  // AQUÍ ENVIAMOS EL NOMBRE PARA LA BARRA DE BÚSQUEDA DEL OTRO PANEL
                                  navigate('/admin/usuarios', { state: { searchTerm: nombreCompleto } });
                                }
                              }}
                            >
                              <option value="" disabled>Acciones...</option>
                              <option value="ver">👁️ Ver Perfil</option>
                              <option value="acciones">⚠️ Tomar acciones con el usuario</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                    {perfilesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center">No hay perfiles registrados.</td>
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

export default PantallaAdministradorPerfiles;