import React from 'react';
import '../style/ValoracionCard.css';

// El componente recibe por "props" la información de una sola valoración
const ValoracionCard = ({ autor, foto, calificacion, texto }) => {
  
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

  return (
    <div className="tarjeta-valoracion">
      
      {/* Lado Izquierdo: Perfil del Autor */}
      <div className="valoracion-perfil-columna">
        {/* Si no hay foto, puedes poner un placeholder por defecto */}
        <img 
          src={foto || `https://ui-avatars.com/api/?name=${autor.replace(' ', '+')}&background=f3961c&color=fff`} 
          alt={`Foto de ${autor}`} 
          className="valoracion-avatar" 
        />
        <span className="valoracion-nombre-autor">{autor}</span>
      </div>

      {/* Lado Derecho: Contenido de la reseña */}
      <div className="valoracion-contenido-columna">
        <p className="valoracion-texto-resena">"{texto}"</p>
        <div className="valoracion-estrellas-contenedor">
          {renderEstrellas(calificacion)}
        </div>
      </div>

    </div>
  );
};

export default ValoracionCard;