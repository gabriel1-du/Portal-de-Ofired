import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { leerMedioDePagoPorId, actualizarMedioDePago } from '../../../../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioEditarMedioDePagoAdmin = ({ medioPagoEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [nombreMedioPago, setNombreMedioPago] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await leerMedioDePagoPorId(medioPagoEdicionId);
        setNombreMedioPago(data.nombreMedioPago || '');
      } catch (err) {
        setError('No se pudo cargar la información.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [medioPagoEdicionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreMedioPago.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      await actualizarMedioDePago(medioPagoEdicionId, { nombreMedioPago }, token);
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
        <h2>Editar Medio de Pago (ID: {medioPagoEdicionId})</h2>
        {cargando ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="admin-form-error">{error}</p>}
            <div className="admin-form-group">
              <label htmlFor="nombreMedioPago">Nombre del Medio de Pago:</label>
              <input type="text" id="nombreMedioPago" value={nombreMedioPago} onChange={(e) => setNombreMedioPago(e.target.value)} required />
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

export default FormularioEditarMedioDePagoAdmin;
