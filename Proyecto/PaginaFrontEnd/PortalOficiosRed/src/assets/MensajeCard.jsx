import React from 'react';
import '../style/MensajeCard.css';

const MensajeCard = ({ mensaje, esMio }) => {
  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div className={`mensaje-card-contenedor ${esMio ? 'mensaje-mio' : 'mensaje-otro'}`}>
      {!esMio && (
        <img 
          src={mensaje.fotoAutor || `https://ui-avatars.com/api/?name=${mensaje.nombreAutor?.replace(' ', '+') || 'U'}&background=03a9f4&color=fff`} 
          alt={`Foto de ${mensaje.nombreAutor}`} 
          className="mensaje-avatar"
        />
      )}
      
      <div className="mensaje-burbuja-cuerpo">
        {!esMio && <span className="mensaje-autor-nombre">{mensaje.nombreAutor}</span>}
        <p className="mensaje-texto-contenido">{mensaje.mensajeTexto}</p>
        <span className="mensaje-fecha-hora">{formatearFecha(mensaje.fechaHoraEnvio)}</span>
      </div>
    </div>
  );
};

export default MensajeCard;
