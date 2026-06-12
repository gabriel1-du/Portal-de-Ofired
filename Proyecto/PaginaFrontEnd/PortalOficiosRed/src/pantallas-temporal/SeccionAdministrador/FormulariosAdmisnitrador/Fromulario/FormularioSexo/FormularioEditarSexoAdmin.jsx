import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { getSexoById, updateSexo } from '../../../../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioEditarSexoAdmin = ({ sexoEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreSexo, setNombreSexo] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarData = async () => {
      try {
        const data = await getSexoById(sexoEdicionId);
        setNombreSexo(data.nombreSexo || '');
      } catch (err) {
        setError('No se pudo cargar la información.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarData();
  }, [sexoEdicionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreSexo.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await updateSexo(sexoEdicionId, { nombreSexo }, token);
      alert('Registro actualizado con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError(err.message || 'Ocurrió un error al actualizar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Editar Sexo (ID: {sexoEdicionId})</h2>
        {cargando ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="admin-form-error">{error}</p>}
            <div className="admin-form-group">
              <label htmlFor="nombreSexo">Nombre del Sexo/Género:</label>
              <input type="text" id="nombreSexo" value={nombreSexo} onChange={(e) => setNombreSexo(e.target.value)} required />
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

export default FormularioEditarSexoAdmin;