import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { createComuna } from '../../../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllRegions } from '../../../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import '../../../../../style/styleAdmin/formulariosAdmin.css';

const FormularioCrearComunaAdmin = ({ onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  
  const [nombreComuna, setNombreComuna] = useState('');
  const [idRegion, setIdRegion] = useState('');
  const [regiones, setRegiones] = useState([]);
  
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const data = await getAllRegions();
        setRegiones(data || []);
      } catch (err) {
        console.error("Error al cargar regiones:", err);
      }
    };
    cargarRegiones();
  }, []);

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
      await createComuna(dto, token);
      alert('Comuna creada con éxito.');
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al crear la comuna:", err);
      setError(err.message || 'Ocurrió un error al crear la comuna.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-modal-close" onClick={onClose}>&times;</button>
        <h2>Crear Nueva Comuna</h2>
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
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearComunaAdmin;