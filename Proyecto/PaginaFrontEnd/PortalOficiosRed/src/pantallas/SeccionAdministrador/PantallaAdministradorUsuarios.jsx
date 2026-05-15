import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leerTodosLosUsuarios } from '../../servicios/usuariosService'; // Importamos tu servicio
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorUsuarios = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo, setMenuActivo] = useState('usuarios'); // Controla la barra lateral

  useEffect(() => {
    // Seguridad extra: Si alguien intenta entrar por la URL sin ser admin, se le expulsa
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }

    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        // Llamamos al método de tu servicio de usuarios (con los paréntesis para ejecutarlo)
        const data = await leerTodosLosUsuarios();
        
        // Como tu servicio devuelve un String cuando hay error, lo manejamos así:
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
    };

    cargarUsuarios();
  }, [token, usuario, navigate]);

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
                        <th>Es Administrador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(u => (
                        <tr key={u.idUsuario || u.id}>
                          <td>{u.idUsuario || u.id}</td>
                          <td>{`${u.primerNombre || u.nombre || ''} ${u.segundoNombre || ''}`}</td>
                          <td>{`${u.primerApellido || u.apellido || ''} ${u.segundoApellido || ''}`}</td>
                          <td>{u.correoElec || u.email}</td>
                          <td>{u.rut ? u.rut : <span style={{color: '#999'}}>N/A (Cliente)</span>}</td>
                          <td>{u.numeroTelef || u.telefono}</td>
                          <td>
                            <span className={`badge-admin ${u.admin || u.habilitador_administrador ? 'si' : 'no'}`}>
                              {u.admin || u.habilitador_administrador ? 'Verdadero' : 'Falso'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {usuarios.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No hay usuarios registrados.</td>
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
    </div>
  );
};

export default PantallaAdministradorUsuarios;
