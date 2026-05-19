import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { actualizarUsuarioAdmin, getUsuarioById } from '../../../servicios/usuariosService';
import { getAllRegions } from '../../../servicios/regionService';
import { getAllComunas } from '../../../servicios/comunasService';
import { getAllOficios } from '../../../servicios/oficioService';
import { getAllSexos } from '../../../servicios/sexoService';
import '../../../style/styleAdmin/formularioEditarUsuarioAdmin.css';

const FormularioEditarUsuarioAdmin = ({ usuarioEdicionId, onClose, onRefresh }) => {
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSexoUsu: '',
    correoElec: '',
    rut: '',
    rutDv: '',
    idTipoUsu: '',
    habilitadorAdministrador: false,
    foto: '',
    numeroTelef: '',
    idRegionUsu: '',
    idComunaUsu: '',
    idOficio: ''
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [sexos, setSexos] = useState([]);
  
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [regionesData, comunasData, oficiosData, sexosData, userData] = await Promise.all([
          getAllRegions(),
          getAllComunas(),
          getAllOficios(),
          getAllSexos(),
          getUsuarioById(usuarioEdicionId) 
        ]);

        if (Array.isArray(regionesData)) setRegiones(regionesData);
        if (Array.isArray(comunasData)) setComunas(comunasData);
        if (Array.isArray(oficiosData)) setOficios(oficiosData);
        if (Array.isArray(sexosData)) setSexos(sexosData);

        if (userData) {
          setFormData({
            primerNombre: userData.primerNombre || '',
            segundoNombre: userData.segundoNombre || '',
            primerApellido: userData.primerApellido || '',
            segundoApellido: userData.segundoApellido || '',
            idSexoUsu: userData.idSexoUsu || '',
            correoElec: userData.correoElec || userData.email || '',
            rut: userData.rut || '',
            rutDv: userData.rutDv || '',
            idTipoUsu: userData.idTipoUsu || '',
            habilitadorAdministrador: userData.habilitadorAdministrador || userData.habilitador_administrador || userData.admin || false,
            foto: userData.foto || '',
            numeroTelef: userData.numeroTelef || userData.telefono || '',
            idRegionUsu: userData.idRegionUsu || '',
            idComunaUsu: userData.idComunaUsu || '',
            idOficio: userData.idOficio || ''
          });
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        setError("Error al cargar los datos del usuario para editar.");
      } finally {
        setCargando(false);
      }
    };

    if (usuarioEdicionId) {
      cargarDatosIniciales();
    }
  }, [usuarioEdicionId]);

  useEffect(() => {
    if (formData.idRegionUsu) {
      const filtradas = comunas.filter(c => c.idRegion === parseInt(formData.idRegionUsu));
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.idRegionUsu, comunas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'idRegionUsu') {
      setFormData(prev => ({ ...prev, [name]: value, idComunaUsu: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        idSexoUsu: formData.idSexoUsu ? parseInt(formData.idSexoUsu) : null,
        idTipoUsu: formData.idTipoUsu ? parseInt(formData.idTipoUsu) : null,
        idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null,
        idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null,
        idOficio: formData.idOficio ? parseInt(formData.idOficio) : null,
      };

      await actualizarUsuarioAdmin(usuarioEdicionId, payload, token);
      alert("Usuario actualizado exitosamente");
      onRefresh(); 
      onClose();   
    } catch (err) {
      setError(err.message || "Error al actualizar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="admin-loading-modal">Cargando datos...</div>;

  return (
    <div className="formulario-admin-modal">
      <div className="formulario-admin-contenido">
        <header className="formulario-admin-header">
          <h2>Editar Usuario (ID: {usuarioEdicionId})</h2>
          <button className="btn-cerrar-modal" onClick={onClose} aria-label="Cerrar">&times;</button>
        </header>

        {error && <div className="admin-error" style={{margin: '15px'}}>{error}</div>}

        <form onSubmit={handleSubmit} className="formulario-admin-grid">
          <div className="form-seccion">
            <h3>1. Datos Personales</h3>
            <div className="form-group-admin"><label>Primer Nombre:</label><input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required /></div>
            <div className="form-group-admin"><label>Segundo Nombre:</label><input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} /></div>
            <div className="form-group-admin"><label>Primer Apellido:</label><input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required /></div>
            <div className="form-group-admin"><label>Segundo Apellido:</label><input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} /></div>
            <div className="form-group-admin"><label>Sexo:</label><select name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange}><option value="">Seleccione...</option>{sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}</select></div>
          </div>

          <div className="form-seccion">
            <h3>2. Datos Críticos</h3>
            <div className="form-group-admin"><label>Correo Electrónico:</label><input type="email" name="correoElec" value={formData.correoElec} onChange={handleChange} required /></div>
            <div className="form-group-admin"><label>RUT (cuerpo):</label><input type="text" name="rut" value={formData.rut} onChange={handleChange} /></div>
            <div className="form-group-admin"><label>RUT (DV):</label><input type="text" name="rutDv" value={formData.rutDv} onChange={handleChange} maxLength="1" /></div>
          </div>

          <div className="form-seccion">
            <h3>3. Permisos y Roles</h3>
            <div className="form-group-admin"><label>Tipo de Usuario:</label><select name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange} required><option value="">Seleccione...</option><option value="1">Cliente (1)</option><option value="2">Profesional/Oficio (2)</option></select></div>
            <div className="form-group-admin checkbox-admin"><label><input type="checkbox" name="habilitadorAdministrador" checked={formData.habilitadorAdministrador} onChange={handleChange} /> Es Administrador</label></div>
            <div className="form-group-admin"><label>URL Foto (opcional):</label><input type="text" name="foto" value={formData.foto} onChange={handleChange} /></div>
          </div>

          <div className="form-seccion">
            <h3>4. Contacto y Ubicación</h3>
            <div className="form-group-admin"><label>Número de Teléfono:</label><input type="text" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} /></div>
            <div className="form-group-admin"><label>Región:</label><select name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange}><option value="">Seleccione...</option>{regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}</select></div>
            <div className="form-group-admin"><label>Comuna:</label><select name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} disabled={!formData.idRegionUsu}><option value="">Seleccione...</option>{comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}</select></div>
            <div className="form-group-admin"><label>Oficio:</label><select name="idOficio" value={formData.idOficio} onChange={handleChange} disabled={String(formData.idTipoUsu) !== '2'}><option value="">Seleccione... (Solo para Profesionales)</option>{oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}</select></div>
          </div>

          <div className="form-acciones-admin">
            <button type="button" className="btn-cancelar-admin" onClick={onClose} disabled={guardando}>Cancelar</button>
            <button type="submit" className="btn-guardar-admin" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar Cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarUsuarioAdmin;
