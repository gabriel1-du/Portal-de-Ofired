import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { createRegion } from '../../../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import '../../../style/styleAdmin/formulariosAdmin.css';

const FormularioCrearRegionAdmin = ({ onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreRegion, setNombreRegion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreRegion.trim()) {
      setError('El nombre de la región no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await createRegion({ nombreRegion }, token);
      alert('Región creada con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al crear la región:", err);
      setError(err.message || 'Ocurrió un error al crear la región.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Crear Nueva Región</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}
          <div className="admin-form-group">
            <label htmlFor="nombreRegion">Nombre de la Región:</label>
            <input
              type="text"
              id="nombreRegion"
              value={nombreRegion}
              onChange={(e) => setNombreRegion(e.target.value)}
              required
            />
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

export default FormularioCrearRegionAdmin;