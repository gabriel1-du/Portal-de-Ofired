import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { getOficioById, updateOficio } from '../../../../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioEditarOficioAdmin = ({ oficioEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreOficio, setNombreOficio] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarOficio = async () => {
      try {
        const data = await getOficioById(oficioEdicionId);
        setNombreOficio(data.nombreOficio || '');
      } catch (err) {
        setError('No se pudo cargar la información del oficio.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarOficio();
  }, [oficioEdicionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreOficio.trim()) {
      setError('El nombre del oficio no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await updateOficio(oficioEdicionId, { nombreOficio }, token);
      alert('Oficio actualizado con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al actualizar el oficio:", err);
      setError(err.message || 'Ocurrió un error al actualizar el oficio.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Editar Oficio (ID: {oficioEdicionId})</h2>
        {cargando ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="admin-form-error">{error}</p>}
            <div className="admin-form-group">
              <label htmlFor="nombreOficio">Nombre del Oficio:</label>
              <input type="text" id="nombreOficio" value={nombreOficio} onChange={(e) => setNombreOficio(e.target.value)} required />
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

export default FormularioEditarOficioAdmin;
