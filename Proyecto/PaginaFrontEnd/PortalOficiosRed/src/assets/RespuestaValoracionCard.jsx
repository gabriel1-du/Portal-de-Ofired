import React from 'react';
import '../style/RespuestaValoracionCard.css';

const RespuestaValoracionCard = ({ nombreDelAutor, fotoAutor, textoRespuestaResenia, fechaCreacion }) => {
  
  // Formatear la fecha para que sea legible (ej: 07/05/2026, 19:20)
  const formatearFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-CL', opciones);
  };

  return (
    <div className="tarjeta-respuesta">
      {/* Lado Izquierdo: Perfil */}
      <div className="respuesta-perfil-columna">
        <img 
          src={fotoAutor || `https://ui-avatars.com/api/?name=${nombreDelAutor.replace(' ', '+')}&background=03a9f4&color=fff`} 
          alt={`Foto de ${nombreDelAutor}`} 
          className="respuesta-avatar" 
        />
        <span className="respuesta-nombre-autor">{nombreDelAutor}</span>
      </div>

      {/* Lado Derecho: Contenido */}
      <div className="respuesta-contenido-columna">
        <p className="respuesta-texto">"{textoRespuestaResenia}"</p>
        <span className="respuesta-fecha">{formatearFecha(fechaCreacion)}</span>
      </div>
    </div>
  );
};

export default RespuestaValoracionCard;