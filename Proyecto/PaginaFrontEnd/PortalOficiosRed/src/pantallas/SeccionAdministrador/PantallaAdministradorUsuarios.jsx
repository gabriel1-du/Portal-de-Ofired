import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leerTodosLosUsuarios, eliminarUsuario } from '../../servicios/usuariosService'; 
import FormularioEditarUsuarioAdmin from './FormulariosAdmisnitrador/FormularioEditarUsuarioAdmin'; 
import FormularioCrearUsuarioAdmin from './FormulariosAdmisnitrador/FormularioCrearUsuarioAdmin'; 
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorUsuarios = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo, setMenuActivo] = useState('usuarios'); 
  const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Estado para la barra de búsqueda
  
  // Estado para controlar a qué usuario estamos editando
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false); // Estado para abrir el modal de creación

  // Extraemos cargarUsuarios en un useCallback para poder llamarlo desde el modal
  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      const data = await leerTodosLosUsuarios();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setUsuarios(data || []);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Seguridad extra: Si alguien intenta entrar por la URL sin ser admin, se le expulsa
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }

    cargarUsuarios();
  }, [usuario, navigate, cargarUsuarios]);

  // Lógica para filtrar los usuarios según lo que se escriba en la barra de búsqueda
  const usuariosFiltrados = usuarios.filter((u) => {
    if (!terminoBusqueda) return true;
    const nombreCompleto = `${u.primerNombre || u.nombre || ''} ${u.segundoNombre || ''} ${u.primerApellido || u.apellido || ''} ${u.segundoApellido || ''}`.toLowerCase();
    return nombreCompleto.includes(terminoBusqueda.toLowerCase());
  });

  // Función para manejar la eliminación de un usuario
  const handleEliminarUsuario = async (idUsuario) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      try {
        await eliminarUsuario(idUsuario, token);
        alert("Usuario eliminado correctamente.");
        cargarUsuarios(); // Recargar la tabla automáticamente
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar el usuario.");
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      {/* Cabecera superior */}
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Salir del panel</button>
        <h1>Panel de Administración</h1>
      </header>

      <div className="admin-body">
        {/* Menú Lateral Izquierdo */}
        <aside className="admin-sidebar-menu">
          <nav>
            <button 
              className={`admin-menu-btn ${menuActivo === 'usuarios' ? 'activo' : ''}`}
              onClick={() => setMenuActivo('usuarios')}
            >
              👥 Entidad: Usuarios
            </button>
            {/* Aquí puedes agregar más entidades en el futuro (Oficios, Reseñas, etc.) */}
          </nav>
        </aside>

        {/* Contenido Principal Derecho (Tabla) */}
        <main className="admin-content-area">
          {menuActivo === 'usuarios' && (
            <div className="admin-panel-usuarios">
              <h2>Tabla de Usuarios</h2>
              <p>Visualización en tiempo real de los datos registrados en el sistema.</p>
              
              {/* Controles de la Tabla: Barra de Búsqueda y Botón Crear */}
              <div className="admin-controles-tabla">
                <input 
                  type="text" 
                  className="admin-busqueda" 
                  placeholder="🔍 Buscar usuario por nombre..." 
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
                <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                  + Crear Usuario
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
                        <th>ID Usuario</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Correo Electrónico</th>
                        <th>RUT</th>
                        <th>Teléfono</th>
                        <th>Región</th>
                        <th>Comuna</th>
                        <th>Es Administrador</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => (
                        <tr key={u.idUsuario || u.id}>
                          <td>{u.idUsuario || u.id}</td>
                          <td>{`${u.primerNombre || u.nombre || ''} ${u.segundoNombre || ''}`}</td>
                          <td>{`${u.primerApellido || u.apellido || ''} ${u.segundoApellido || ''}`}</td>
                          <td>{u.correoElec || u.email}</td>
                          <td>{u.rut ? u.rut : <span style={{color: '#999'}}>N/A (Cliente)</span>}</td>
                          <td>{u.numeroTelef || u.telefono}</td>
                          <td>{u.nombreRegion || u.idRegionUsu || <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>{u.nombreComuna || u.idComunaUsu || <span style={{color: '#999'}}>N/A</span>}</td>
                          <td>
                            <span className={`badge-admin ${u.admin || u.habilitador_administrador ? 'si' : 'no'}`}>
                              {u.admin || u.habilitador_administrador ? 'Verdadero' : 'Falso'}
                            </span>
                          </td>
                          <td>
                            {/* Botón Desplegable Nativo para Acciones */}
                            <select 
                              className="admin-action-select"
                              value=""
                              onChange={(e) => {
                                if (e.target.value === 'editar') setUsuarioEditandoId(u.idUsuario || u.id);
                                if (e.target.value === 'eliminar') handleEliminarUsuario(u.idUsuario || u.id);
                              }}
                            >
                              <option value="" disabled>Acciones...</option>
                              <option value="editar">✏️ Editar</option>
                              <option value="eliminar">🗑️ Eliminar</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {usuariosFiltrados.length === 0 && (
                        <tr>
                          <td colSpan="10" className="text-center">No hay usuarios registrados.</td>
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

      {/* Renderizamos el modal flotante de edición si hay un ID seleccionado */}
      {usuarioEditandoId && (
        <FormularioEditarUsuarioAdmin 
          usuarioEdicionId={usuarioEditandoId} 
          onClose={() => setUsuarioEditandoId(null)} 
          onRefresh={cargarUsuarios}
        />
      )}

      {/* Renderizamos el modal de creación si se presionó "+ Crear Usuario" */}
      {mostrarModalCrear && (
        <FormularioCrearUsuarioAdmin 
          onClose={() => setMostrarModalCrear(false)} 
          onRefresh={cargarUsuarios}
        />
      )}
    </div>
  );
};

export default PantallaAdministradorUsuarios;
