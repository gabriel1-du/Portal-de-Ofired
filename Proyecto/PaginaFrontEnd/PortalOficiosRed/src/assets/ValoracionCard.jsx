import React from 'react';
import '../style/ValoracionCard.css';

// El componente recibe por "props" la información de una sola valoración
const ValoracionCard = ({ autor, foto, calificacion, texto, fecha, usuarioReseniado }) => {
  
  // Función para renderizar las estrellas dinámicamente
  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    for (let i = 0; i < 5; i++) {
      estrellas.push(
        <span key={i} className={i < calificacion ? "estrella activa" : "estrella inactiva"}>
          ★
        </span>
      );
    }
    return estrellas;
  };

  // Formatear la fecha para hacerla entendible (ej: 8 de mayo de 2026, 10:00)
  const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div className="tarjeta-valoracion">
      
      {/* Lado Izquierdo: Perfil del Autor */}
      <div className="valoracion-perfil-columna">
        {/* Si no hay foto, puedes poner un placeholder por defecto */}
        <img 
          src={foto || `https://ui-avatars.com/api/?name=${autor ? autor.replace(' ', '+') : 'Usuario'}&background=f3961c&color=fff`} 
          alt={`Foto de ${autor}`} 
          className="valoracion-avatar" 
        />
        <span className="valoracion-nombre-autor">{autor || "Usuario Anónimo"}</span>
      </div>

      {/* Lado Derecho: Contenido de la reseña */}
      <div className="valoracion-contenido-columna">
        <div className="valoracion-encabezado" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="valoracion-estrellas-contenedor">
            {renderEstrellas(calificacion)}
          </div>
          {fechaFormateada && <span className="valoracion-fecha" style={{ fontSize: '0.85rem', color: '#6c757d' }}>{fechaFormateada}</span>}
        </div>
        {usuarioReseniado && <p className="valoracion-reseniado" style={{ fontSize: '0.9rem', color: '#f3961c', fontWeight: 'bold', margin: '0 0 8px 0' }}>Para: {usuarioReseniado}</p>}
        <p className="valoracion-texto-resena">{texto}</p>
      </div>

    </div>
  );
};

export default ValoracionCard;