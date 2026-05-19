import React from 'react';
import '../style/TratoCard.css';

const TratoCard = ({ trato, usuarioLogueado, onActualizarEstado }) => {
  // NOTA: Aquí se valida que el Cliente es quien puede Aceptar/Rechazar. 
  // Si requieres que sea el Oferente, cambia 'idUsuarioCliente' por 'idUsuarioOferente'.
  const esQuienDebeAceptar = usuarioLogueado.idUsuario === trato.idUsuarioCliente;
  const idDelTrato = trato.idTransaccion;

  const handleAceptar = () => {
    // Si ya es true o false, bloqueamos la acción con la alerta
    if (trato.aceptado !== null && trato.aceptado !== undefined) {
      alert("Ya se ha aceptado o rechazado este trato.");
      return;
    }
    if(window.confirm("¿Estás seguro de aceptar este trato?")) {
      onActualizarEstado(idDelTrato, true);
    }
  };
  
  const handleRechazar = () => {
    // Si ya es true o false, bloqueamos la acción con la alerta
    if (trato.aceptado !== null && trato.aceptado !== undefined) {
      alert("Ya se ha aceptado o rechazado este trato.");
      return;
    }
    if(window.confirm("¿Estás seguro de rechazar este trato?")) {
      onActualizarEstado(idDelTrato, false);
    }
  };

  let estadoTexto = "Sin decisión";
  let estadoClase = "pendiente";
  if (trato.aceptado === true) { estadoTexto = "Aceptado"; estadoClase = "aceptado"; } 
  else if (trato.aceptado === false) { estadoTexto = "Rechazado"; estadoClase = "rechazado"; }

  return (
    <div className="trato-card">
      <div className="trato-header">
        <h4>Trato #{idDelTrato}</h4>
        <span className={`estado-badge ${estadoClase}`}>{estadoTexto}</span>
      </div>
      <div className="trato-body">
        <p><strong>Monto del Servicio:</strong> ${trato.montoServicio}</p>
        <p><strong>Oferente:</strong> {trato.nombreUsuarioOferente}</p>
        <p><strong>Cliente:</strong> {trato.nombreUsuarioCliente}</p>
        <p><strong>Trabajo:</strong> {trato.nombreTipoTrabajo}</p>
        <p><strong>Pago:</strong> {trato.nombreMedioPago}</p>
        <p><strong>Observaciones:</strong> {trato.observacionesTrato || 'Sin observaciones'}</p>
      </div>
      
      {/* Mostramos los botones si el usuario actual es el cliente. La validación se hace en el onClick */}
      {esQuienDebeAceptar && (
        <div className="trato-footer">
          <button className="btn-rechazar" onClick={handleRechazar}>Rechazar</button>
          <button className="btn-aceptar" onClick={handleAceptar}>Aceptar</button>
        </div>
      )}
    </div>
  );
};
export default TratoCard;
