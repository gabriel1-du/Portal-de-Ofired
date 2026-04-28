import React, { useState, useEffect } from 'react';
import { getPerfilFrontByUsuarioId } from '../servicios/perfilesUsuarioService'; // Asegúrate de que la ruta sea correcta
import '../style/PerfilPantalla.css';

const PerfilPantalla = () => {
  // Variable de prueba manual que solicitaste
  const ID_PRUEBA = 22;

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargando(true);
        const datos = await getPerfilFrontByUsuarioId(ID_PRUEBA);
        
        if (!datos) {
          setError("No se encontró el perfil para este usuario.");
        } else {
          setPerfil(datos);
        }
      } catch (err) {
        setError("Ocurrió un error al intentar cargar el perfil.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  if (cargando) return <div className="estado-mensaje">Cargando perfil...</div>;
  if (error) return <div className="estado-mensaje error">{error}</div>;
  if (!perfil) return null;

  // Destructuramos TODOS los atributos del JSON como pediste
  const {
    idPerfilUsuario,
    idUsuario,
    correoElec,
    nombreApodo,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    numeroTelef,
    foto,
    fotografiaBanner,
    descripcion,
    nombreRegion,
    nombreComuna,
    nombreOficio,
    nombreSexo,
    calificacion,
    fechaCreacion
  } = perfil;

  // Armamos el nombre completo (manejando si no hay segundo nombre/apellido)
  const nombreCompleto = `${primerNombre} ${segundoNombre || ''} ${primerApellido} ${segundoApellido || ''}`.trim();

  return (
    <div className="perfil-pantalla-contenedor">
      
      {/* 1. SECCIÓN BANNER */}
      <div className="perfil-banner">
        <img 
          src={fotografiaBanner || 'https://via.placeholder.com/1200x300?text=Banner'} 
          alt="Banner del usuario" 
        />
      </div>

      {/* 2. CABECERA (Foto, Nombres y Botones) */}
      <div className="perfil-cabecera">
        <div className="perfil-foto-wrapper">
          <img 
            src={foto || 'https://via.placeholder.com/150'} 
            alt={`Foto de ${nombreApodo}`} 
          />
        </div>
        
        <div className="perfil-nombres">
          <h1 className="apodo-texto">{nombreApodo}</h1>
          <p className="nombre-real-texto">{nombreCompleto}</p>
        </div>

        <div className="perfil-acciones">
          <button className="btn-maqueta btn-reportar">
             Reportar 🚨
          </button>
          <button className="btn-maqueta btn-configurar">
             Configurar ⚙️
          </button>
        </div>
      </div>

      {/* 3. CONTENIDO INFERIOR (Cajas de Info y Descripción) */}
      <div className="perfil-contenido-inferior">
        
        {/* Caja Izquierda: Info Gris Claro */}
        <div className="caja-info-basica">
          <div className="info-item">
            <span className="info-label">Oficio:</span>
            <span className="info-valor destacado">{nombreOficio}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Comuna:</span>
            <span className="info-valor">{nombreComuna}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Región:</span>
            <span className="info-valor">{nombreRegion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Calificación:</span>
            <span className="info-valor estrellas">
              {/* Simulamos estrellas según la calificación */}
              {calificacion > 0 ? `⭐ ${calificacion}` : 'Sin calificación'}
            </span>
          </div>
        </div>

        {/* Caja Derecha: Descripción (Vertical) */}
        <div className="caja-descripcion">
          <h3>Descripción</h3>
          <div className="descripcion-texto">
            <p>{descripcion || 'Sin descripción disponible por el momento. Aquí irá el texto sobre la experiencia y habilidades del profesional.'}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PerfilPantalla;