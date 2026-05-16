import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { crearUsuarioPorAdmin } from '../../../servicios/usuariosService';
import { getAllRegions } from '../../../servicios/regionService';
import { getAllComunas } from '../../../servicios/comunasService';
import { getAllSexos } from '../../../servicios/sexoService';
import { getAllOficios } from '../../../servicios/oficioService';

const FormularioCrearUsuarioAdmin = ({ onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);

  // Mapeado exactamente a crearUsuarioDTOAdmin
  const [formData, setFormData] = useState({
    primerNombre: '', segundoNombre: '',
    primerApellido: '', segundoApellido: '',
    correoElec: '', password: '',
    rutCompleto: '', numeroTelef: '',
    habilitadorAdministrador: false,
    idSexoUsu: '', idTipoUsu: '',
    idRegionUsu: '', idComunaUsu: '', idOficio: ''
  });

  const [catalogos, setCatalogos] = useState({ regiones: [], comunas: [], sexos: [], oficios: [] });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [regiones, comunas, sexos, oficios] = await Promise.all([
          getAllRegions(), getAllComunas(), getAllSexos(), getAllOficios()
        ]);
        setCatalogos({ regiones: regiones||[], comunas: comunas||[], sexos: sexos||[], oficios: oficios||[] });
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
      }
    };
    cargarCatalogos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      let rutCuerpo = null;
      let rutDv = null;

      // Separar el RUT de su dígito verificador
      if (formData.rutCompleto) {
        const rutLimpio = formData.rutCompleto.replace(/[^0-9kK]/g, '').toLowerCase();
        rutCuerpo = rutLimpio.slice(0, -1);
        rutDv = rutLimpio.slice(-1);
      }

      const dto = {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido || null,
        correoElec: formData.correoElec,
        password: formData.password,
        rut: rutCuerpo || null,
        rutDv: rutDv || null,
        numeroTelef: formData.numeroTelef || null,
        foto: null, // Asumimos null por defecto al crear como admin
        valoracion: 0.0,
        habilitadorAdministrador: formData.habilitadorAdministrador,
        idSexoUsu: formData.idSexoUsu ? parseInt(formData.idSexoUsu) : null,
        idTipoUsu: formData.idTipoUsu ? parseInt(formData.idTipoUsu) : null,
        idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null,
        idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null,
        // Forzamos a que si el tipo de usuario no es 2 (Profesional), el idOficio sea nulo.
        idOficio: (parseInt(formData.idTipoUsu) === 2 && formData.idOficio) ? parseInt(formData.idOficio) : null,
      };

      console.log("JSON estricto enviado a Spring Boot:", JSON.stringify(dto, null, 2)); // Para que valides

      await crearUsuarioPorAdmin(dto, token);
      alert('Usuario creado exitosamente con privilegios especificados.');
      onRefresh(); // Refrescamos la tabla base
      onClose(); // Cerramos el modal
    } catch (err) {
      setError(err.message || 'Ocurrió un error al crear el usuario.');
    } finally {
      setCargando(false);
    }
  };

  // Filtrar comunas dependiendo de la región seleccionada
  const comunasFiltradas = formData.idRegionUsu 
    ? catalogos.comunas.filter(c => c.idRegion === parseInt(formData.idRegionUsu)) 
    : catalogos.comunas;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-contenido">
        <div className="admin-modal-header">
          <h3>Crear Nuevo Usuario</h3>
          <button type="button" className="btn-cerrar-modal" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="admin-error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-form-grid">
          
          {/* Privilegio Especial */}
          <div className="admin-form-group-checkbox full-width">
            <label htmlFor="habilitadorAdministrador">Habilitar permisos admin</label>
            <input type="checkbox" id="habilitadorAdministrador" name="habilitadorAdministrador" checked={formData.habilitadorAdministrador} onChange={handleChange} />
            <span className="tooltip-admin">Dará control total sobre el panel.</span>
          </div>

          <div className="admin-form-group"><label>Primer Nombre *</label><input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required /></div>
          <div className="admin-form-group"><label>Segundo Nombre</label><input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} /></div>
          <div className="admin-form-group"><label>Primer Apellido *</label><input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required /></div>
          <div className="admin-form-group"><label>Segundo Apellido</label><input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} /></div>
          
          <div className="admin-form-group"><label>Correo Electrónico *</label><input type="email" name="correoElec" value={formData.correoElec} onChange={handleChange} required /></div>
          <div className="admin-form-group"><label>Contraseña *</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
          <div className="admin-form-group"><label>RUT (Sin puntos ni guion)</label><input type="text" name="rutCompleto" placeholder="Ej: 123456789" value={formData.rutCompleto} onChange={handleChange} /></div>
          <div className="admin-form-group"><label>Teléfono</label><input type="text" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} /></div>

          <div className="admin-form-group">
            <label>Tipo de Usuario *</label>
            <select name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              <option value="1">Cliente (1)</option>
              <option value="2">Profesional/Oficio (2)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Oficio (Si aplica)</label>
            <select name="idOficio" value={formData.idOficio} onChange={handleChange} disabled={parseInt(formData.idTipoUsu) !== 2}>
              <option value="">Ninguno</option>
              {catalogos.oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Sexo *</label>
            <select name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {catalogos.sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Región</label>
            <select name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {catalogos.regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Comuna</label>
            <select name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}
            </select>
          </div>

          <div className="full-width">
            <button type="submit" className="btn-submit-modal" disabled={cargando}>
              {cargando ? 'Creando...' : 'Guardar Nuevo Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearUsuarioAdmin;
