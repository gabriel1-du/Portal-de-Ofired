import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { crearMedioDePago } from '../../../../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioCrearMedioDePagoAdmin = ({ onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreMedioPago, setNombreMedioPago] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreMedioPago.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await crearMedioDePago({ nombreMedioPago }, token);
      alert('Registro creado con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al crear el registro:", err);
      setError(err.message || 'Ocurrió un error al crear el registro.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Crear Medio de Pago</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}
          <div className="admin-form-group">
            <label htmlFor="nombreMedioPago">Nombre del Medio de Pago:</label>
            <input type="text" id="nombreMedioPago" value={nombreMedioPago} onChange={(e) => setNombreMedioPago(e.target.value)} required />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn-guardar" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearMedioDePagoAdmin;