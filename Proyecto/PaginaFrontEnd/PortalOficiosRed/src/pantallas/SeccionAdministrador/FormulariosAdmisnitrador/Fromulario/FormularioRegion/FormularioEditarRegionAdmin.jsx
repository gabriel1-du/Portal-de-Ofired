import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getRegionById, updateRegion } from '../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import '../../../style/styleAdmin/formulariosAdmin.css';

const FormularioEditarRegionAdmin = ({ regionEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreRegion, setNombreRegion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarRegion = async () => {
      try {
        const data = await getRegionById(regionEdicionId);
        setNombreRegion(data.nombreRegion || '');
      } catch (err) {
        setError('No se pudo cargar la información de la región.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarRegion();
  }, [regionEdicionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreRegion.trim()) {
      setError('El nombre de la región no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await updateRegion(regionEdicionId, { nombreRegion }, token);
      alert('Región actualizada con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al actualizar la región:", err);
      setError(err.message || 'Ocurrió un error al actualizar la región.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Editar Región (ID: {regionEdicionId})</h2>
        {cargando ? (
          <p>Cargando...</p>
        ) : (
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
                {enviando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormularioEditarRegionAdmin;