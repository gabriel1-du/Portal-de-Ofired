import React from 'react';
import '../../style/cards/ValoracionCard.css';

// El componente recibe por "props" la información de una sola valoración
const ValoracionCard = ({ autor, foto, calificacion, texto, fecha, usuarioReseniado }) => {
  
  // Función para renderizar las estrellas dinámicamente
  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    for (let i = 0; i < 5; i++) {
      estrellas.push(
        <span key={i} className={i < calificacion ? 'valoracion-estrella activa' : 'valoracion-estrella inactiva'}>
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
    <div className="card border-0 shadow-sm rounded-4 w-100 bg-white mb-3 valoracion-tarjeta-moderna">
      <div className="card-body p-4 row g-0 align-items-center">
        
        {/* Lado Izquierdo: Perfil del Autor */}
        <div className="col-12 col-sm-3 col-md-2 d-flex flex-column align-items-center justify-content-center text-center mb-3 mb-sm-0">
          <img 
            src={foto || `https://ui-avatars.com/api/?name=${autor ? autor.replace(' ', '+') : 'Usuario'}&background=f3961c&color=fff`} 
            alt={`Foto de ${autor}`} 
            className="valoracion-avatar-moderno rounded-circle object-fit-cover shadow-sm mb-2" 
          />
          <h6 className="fw-bold text-dark mb-0">{autor || "Usuario Anónimo"}</h6>
        </div>

        {/* Lado Derecho: Contenido de la reseña */}
        <div className="col-12 col-sm-9 col-md-10 ps-sm-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              {renderEstrellas(calificacion)}
            </div>
            {fechaFormateada && <small className="text-muted fst-italic">{fechaFormateada}</small>}
          </div>
          {usuarioReseniado && <div className="badge bg-light text-dark border mb-2 px-2 py-1">Para: <span className="valoracion-destacado fw-bold">{usuarioReseniado}</span></div>}
          <p className="valoracion-texto-moderno text-secondary mb-0">"{texto}"</p>
        </div>
      </div>

    </div>
  );
};

export default ValoracionCard;