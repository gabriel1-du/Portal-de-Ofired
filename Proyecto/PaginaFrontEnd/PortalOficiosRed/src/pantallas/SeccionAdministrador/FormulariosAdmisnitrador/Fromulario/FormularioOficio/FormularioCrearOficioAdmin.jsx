import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { createOficio } from '../../../../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioCrearOficioAdmin = ({ onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreOficio, setNombreOficio] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreOficio.trim()) {
      setError('El nombre del oficio no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await createOficio({ nombreOficio }, token);
      alert('Oficio creado con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al crear el oficio:", err);
      setError(err.message || 'Ocurrió un error al crear el oficio.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Crear Nuevo Oficio</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}
          <div className="admin-form-group">
            <label htmlFor="nombreOficio">Nombre del Oficio:</label>
            <input type="text" id="nombreOficio" value={nombreOficio} onChange={(e) => setNombreOficio(e.target.value)} required />
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

export default FormularioCrearOficioAdmin;