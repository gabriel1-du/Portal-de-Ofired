import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { getComunaById, updateComuna } from '../../../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllRegions } from '../../../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioEditarComunaAdmin = ({ comunaEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  
  const [nombreComuna, setNombreComuna] = useState('');
  const [idRegion, setIdRegion] = useState('');
  const [regiones, setRegiones] = useState([]);
  
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [comunaData, regionesData] = await Promise.all([
          getComunaById(comunaEdicionId),
          getAllRegions()
        ]);
        
        setNombreComuna(comunaData.nombreComuna || '');
        setIdRegion(comunaData.idRegion || '');
        setRegiones(regionesData || []);
      } catch (err) {
        setError('No se pudo cargar la información de la comuna o las regiones.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [comunaEdicionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreComuna.trim() || !idRegion) {
      setError('El nombre de la comuna y la región son obligatorios.');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      const dto = {
        nombreComuna,
        idRegion: parseInt(idRegion)
      };
      await updateComuna(comunaEdicionId, dto, token);
      alert('Comuna actualizada con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al actualizar la comuna:", err);
      setError(err.message || 'Ocurrió un error al actualizar la comuna.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Editar Comuna (ID: {comunaEdicionId})</h2>
        {cargando ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="admin-form-error">{error}</p>}
            
            <div className="admin-form-group">
              <label>Región a la que pertenece:</label>
              <select value={idRegion} onChange={(e) => setIdRegion(e.target.value)} required>
                <option value="">Seleccione una región...</option>
                {regiones.map(r => (
                  <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Nombre de la Comuna:</label>
              <input type="text" value={nombreComuna} onChange={(e) => setNombreComuna(e.target.value)} required />
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

export default FormularioEditarComunaAdmin;
