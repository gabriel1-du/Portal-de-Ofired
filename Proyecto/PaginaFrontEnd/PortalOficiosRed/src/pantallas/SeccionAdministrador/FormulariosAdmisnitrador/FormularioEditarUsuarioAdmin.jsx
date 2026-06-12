import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { actualizarUsuarioAdmin, getUsuarioById } from '../../../servicios/usuariosService';
import { getAllRegions } from '../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllOficios } from '../../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import { getAllSexos } from '../../../servicios/ApiUsuarios/TablasCategorias/sexoService';

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
    foto: null,
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
            foto: null, // Mantenemos nulo para la carga de nuevos archivos
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
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files.length > 0 ? files[0] : null }));
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

  if (cargando) return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Cargando datos...</span>
      </div>
    </div>
  );

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, padding: '1rem' }}>
      <div className="card shadow-lg border-0 rounded-4 w-100 d-flex flex-column bg-white" style={{ maxWidth: '900px', maxHeight: '90vh' }}>
        <header className="card-header bg-white d-flex justify-content-between align-items-center p-4 border-bottom">
          <h2 className="m-0 fs-4 fw-bolder text-dark">Editar Usuario (ID: {usuarioEdicionId})</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
        </header>

        <div className="card-body p-4 p-md-5 overflow-auto">
          {error && <div className="alert alert-danger shadow-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            
            <div className="row g-4 mb-5">
              <div className="col-12">
                <h3 className="fs-5 fw-bold text-primary border-bottom pb-2 mb-0">1. Datos Personales</h3>
              </div>
              <div className="col-md-6"><label className="form-label fw-bold">Primer Nombre:</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required /></div>
              <div className="col-md-6"><label className="form-label fw-bold">Segundo Nombre:</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} /></div>
              <div className="col-md-6"><label className="form-label fw-bold">Primer Apellido:</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required /></div>
              <div className="col-md-6"><label className="form-label fw-bold">Segundo Apellido:</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} /></div>
              <div className="col-md-6"><label className="form-label fw-bold">Sexo:</label><select className="form-select form-control-lg bg-light shadow-sm border-0" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange}><option value="">Seleccione...</option>{sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}</select></div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-12">
                <h3 className="fs-5 fw-bold text-primary border-bottom pb-2 mb-0">2. Datos Críticos</h3>
              </div>
              <div className="col-md-12"><label className="form-label fw-bold">Correo Electrónico:</label><input type="email" className="form-control form-control-lg bg-light shadow-sm border-0" name="correoElec" value={formData.correoElec} onChange={handleChange} required /></div>
              <div className="col-md-6"><label className="form-label fw-bold">RUT (cuerpo):</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="rut" value={formData.rut} onChange={handleChange} /></div>
              <div className="col-md-6"><label className="form-label fw-bold">RUT (DV):</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="rutDv" value={formData.rutDv} onChange={handleChange} maxLength="1" /></div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-12">
                <h3 className="fs-5 fw-bold text-primary border-bottom pb-2 mb-0">3. Permisos y Roles</h3>
              </div>
              <div className="col-md-6"><label className="form-label fw-bold">Tipo de Usuario:</label><select className="form-select form-control-lg bg-light shadow-sm border-0" name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange} required><option value="">Seleccione...</option><option value="1">Cliente (1)</option><option value="2">Profesional/Oficio (2)</option></select></div>
              <div className="col-md-6"><label className="form-label fw-bold">Nueva Foto de Perfil (opcional):</label><input type="file" accept="image/*" className="form-control form-control-lg bg-light shadow-sm border-0" name="foto" onChange={handleChange} /></div>
              
              <div className="col-12 mt-4">
                <div className="form-check bg-light p-3 border rounded shadow-sm">
                  <input className="form-check-input ms-1 me-3" type="checkbox" id="checkAdminEdit" name="habilitadorAdministrador" checked={formData.habilitadorAdministrador} onChange={handleChange} />
                  <label className="form-check-label fw-bold text-danger" htmlFor="checkAdminEdit">Es Administrador</label>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-12">
                <h3 className="fs-5 fw-bold text-primary border-bottom pb-2 mb-0">4. Contacto y Ubicación</h3>
              </div>
              <div className="col-md-6"><label className="form-label fw-bold">Número de Teléfono:</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} /></div>
              <div className="col-md-6"><label className="form-label fw-bold">Región:</label><select className="form-select form-control-lg bg-light shadow-sm border-0" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange}><option value="">Seleccione...</option>{regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}</select></div>
              <div className="col-md-6"><label className="form-label fw-bold">Comuna:</label><select className="form-select form-control-lg bg-light shadow-sm border-0" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} disabled={!formData.idRegionUsu}><option value="">Seleccione...</option>{comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}</select></div>
              <div className="col-md-6"><label className="form-label fw-bold">Oficio:</label><select className="form-select form-control-lg bg-light shadow-sm border-0" name="idOficio" value={formData.idOficio} onChange={handleChange} disabled={String(formData.idTipoUsu) !== '2'}><option value="">Seleccione... (Solo para Profesionales)</option>{oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}</select></div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
              <button type="button" className="btn btn-secondary px-4 py-2 fw-bold" onClick={onClose} disabled={guardando}>Cancelar</button>
              <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarUsuarioAdmin;
