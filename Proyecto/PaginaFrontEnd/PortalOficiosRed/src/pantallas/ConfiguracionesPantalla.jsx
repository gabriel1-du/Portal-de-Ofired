import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/seccionPantallas/configPantalla.css';

const ConfiguracionesPantalla = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  // Estado para controlar qué opción del menú lateral está seleccionada
  const [menuActivo, setMenuActivo] = useState('datos');

  return (
    <div className="container position-relative my-5">
      {/* Botón Volver Flotante */}
      <button 
        className="btn-volver-flotante" 
        onClick={() => navigate(-1)} 
        aria-label="Volver"
      >
        &#10094;
      </button>

      {/* mt-5 y pt-4 empujan todo el contenido hacia abajo, separándolo del botón de volver */}
      <div className="row g-4 mt-5 pt-4">
        
        {/* --- SIDEBAR (Menú Lateral Izquierdo) --- */}
        <div className="col-12 col-md-4 col-lg-3">
          <aside className="bg-light border rounded-4 p-4 d-flex flex-column h-100">
            <h2 className="fs-5 fw-bolder text-dark mb-4 px-2">Configuración</h2>
          
            <nav className="d-flex flex-column gap-2 flex-grow-1">
            <button
              className={`sidebar-btn ${menuActivo === 'datos' ? 'activo' : ''}`}
              onClick={() => setMenuActivo('datos')}
            >
              Datos personales
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

            <div className="mt-auto pt-4 border-top mt-4">
            <button className="sidebar-btn btn-cerrar-sesion">
              Cerrar sesión
            </button>
          </div>
        </aside>
        </div>

        {/* --- CONTENIDO PRINCIPAL (Panel Derecho) --- */}
        <div className="col-12 col-md-8 col-lg-9">
          <main className="bg-light border rounded-4 p-4 p-md-5 h-100">
          {menuActivo === 'datos' && (
              <div>
                <h3 className="fs-3 fw-bolder text-dark mb-2">Datos Personales</h3>
                <p className="text-secondary mb-4">
                Administra tu información básica de cuenta y métodos de contacto.
              </p>

                <div className="d-flex flex-column gap-3">
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
        </main>
        </div>

      </div>
    </div>
  );
};

export default ConfiguracionesPantalla;