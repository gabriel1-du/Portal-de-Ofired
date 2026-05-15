import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/configPantalla.css';

const ConfiguracionesPantalla = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  // Estado para controlar qué opción del menú lateral está seleccionada
  const [menuActivo, setMenuActivo] = useState('datos');

  return (
    <div className="configuraciones-contenedor">
      {/* Botón Volver Flotante */}
      <button 
        className="btn-volver-flotante" 
        onClick={() => navigate(-1)} 
        aria-label="Volver"
      >
        &#10094;
      </button>

      <div className="configuraciones-layout">
        
        {/* --- SIDEBAR (Menú Lateral Izquierdo) --- */}
        <aside className="configuraciones-sidebar">
          <h2 className="sidebar-titulo">Configuración</h2>
          
          <nav className="sidebar-nav">
            <button
              className={`sidebar-btn ${menuActivo === 'datos' ? 'activo' : ''}`}
              onClick={() => setMenuActivo('datos')}
            >
              Datos personales
            </button>
            <button
              className={`sidebar-btn ${menuActivo === 'mensajeria' ? 'activo' : ''}`}
              onClick={() => setMenuActivo('mensajeria')}
            >
              Mensajería
            </button>
            {/* Solo mostramos el menú si el usuario tiene permiso de administrador */}
            {(usuario?.habilitador_administrador === true || usuario?.habilitadorAdministrador === true) && (
              <button
                className="sidebar-btn"
                onClick={() => navigate('/admin/usuarios')}
              >
                Menú administrador
              </button>
            )}
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-btn btn-cerrar-sesion">
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* --- CONTENIDO PRINCIPAL (Panel Derecho) --- */}
        <main className="configuraciones-contenido">
          {menuActivo === 'datos' && (
            <div className="panel-datos">
              <h3 className="panel-titulo">Datos Personales</h3>
              <p className="panel-descripcion">
                Administra tu información básica de cuenta y métodos de contacto.
              </p>

              <div className="opciones-lista">
                {/* Botón: Cambiar Correo */}
                <button className="opcion-tarjeta" onClick={() => navigate('/configuracion/cambiar-correo')}>
                  <div className="opcion-info">
                    <span className="opcion-icono">✉️</span>
                    <span className="opcion-texto">Cambiar correo</span>
                  </div>
                  <span className="opcion-flecha">&#10095;</span>
                </button>

                {/* Botón: Cambiar Teléfono */}
                <button className="opcion-tarjeta" onClick={() => navigate('/configuracion/cambiar-telefono')}>
                  <div className="opcion-info">
                    <span className="opcion-icono">📱</span>
                    <span className="opcion-texto">Cambiar Teléfono</span>
                  </div>
                  <span className="opcion-flecha">&#10095;</span>
                </button>

                {/* Botón: Modificar Datos */}
                <button className="opcion-tarjeta" onClick={() => navigate('/configuracion/modificar-datos')}>
                  <div className="opcion-info">
                    <span className="opcion-icono">👤</span>
                    <span className="opcion-texto">Modificar datos personales</span>
                  </div>
                  <span className="opcion-flecha">&#10095;</span>
                </button>
              </div>
            </div>
          )}

          {/* Aquí podrías agregar los otros paneles en el futuro */}
          {menuActivo === 'mensajeria' && (
            <div className="panel-datos">
              <h3 className="panel-titulo">Mensajería</h3>
              <p className="panel-descripcion">Tus ajustes de chat aparecerán aquí.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ConfiguracionesPantalla;