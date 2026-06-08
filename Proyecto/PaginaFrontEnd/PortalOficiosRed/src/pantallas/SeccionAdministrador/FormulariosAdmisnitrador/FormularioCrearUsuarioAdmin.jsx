import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { crearUsuarioPorAdmin } from '../../../servicios/usuariosService';
import { getAllRegions } from '../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllSexos } from '../../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import { getAllOficios } from '../../../servicios/ApiUsuarios/TablasCategorias/oficioService';

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
    idRegionUsu: '', idComunaUsu: '', idOficio: '',
    foto: null
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
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? (files.length > 0 ? files[0] : null) : value
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
        foto: formData.foto, // Enviamos el archivo
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
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, padding: '1rem' }}>
      <div className="card shadow-lg border-0 rounded-4 w-100 d-flex flex-column bg-white" style={{ maxWidth: '900px', maxHeight: '90vh' }}>
        
        <div className="card-header bg-white d-flex justify-content-between align-items-center p-4 border-bottom">
          <h3 className="m-0 fs-4 fw-bolder text-dark">Crear Nuevo Usuario</h3>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
        </div>
        
        <div className="card-body p-4 p-md-5 overflow-auto">
          {error && <div className="alert alert-danger shadow-sm text-center mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="row g-4">
            
            {/* Privilegio Especial */}
            <div className="col-12 mb-2">
              <div className="form-check bg-light p-3 border rounded shadow-sm">
                <input className="form-check-input ms-1 me-3" type="checkbox" id="habilitadorAdministrador" name="habilitadorAdministrador" checked={formData.habilitadorAdministrador} onChange={handleChange} />
                <label className="form-check-label fw-bold text-danger" htmlFor="habilitadorAdministrador">Habilitar permisos admin</label>
                <div className="form-text text-muted ms-4">Dará control total sobre el panel.</div>
              </div>
            </div>

            <div className="col-md-6"><label className="form-label fw-bold">Primer Nombre *</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Segundo Nombre</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Primer Apellido *</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Segundo Apellido</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} /></div>
            
            <div className="col-md-6"><label className="form-label fw-bold">Correo Electrónico *</label><input type="email" className="form-control form-control-lg bg-light shadow-sm border-0" name="correoElec" value={formData.correoElec} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Contraseña *</label><input type="password" className="form-control form-control-lg bg-light shadow-sm border-0" name="password" value={formData.password} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label fw-bold">RUT (Sin puntos ni guion)</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="rutCompleto" placeholder="Ej: 123456789" value={formData.rutCompleto} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Teléfono</label><input type="text" className="form-control form-control-lg bg-light shadow-sm border-0" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} /></div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Tipo de Usuario *</label>
              <select className="form-select form-control-lg bg-light shadow-sm border-0" name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                <option value="1">Cliente (1)</option>
                <option value="2">Profesional/Oficio (2)</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Oficio (Si aplica)</label>
              <select className="form-select form-control-lg bg-light shadow-sm border-0" name="idOficio" value={formData.idOficio} onChange={handleChange} disabled={parseInt(formData.idTipoUsu) !== 2}>
                <option value="">Ninguno</option>
                {catalogos.oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}
              </select>
            </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Foto (Opcional)</label>
            <input type="file" accept="image/*" className="form-control form-control-lg bg-light shadow-sm border-0" name="foto" onChange={handleChange} />
          </div>

          <div className="col-md-6">
              <label className="form-label fw-bold">Sexo *</label>
              <select className="form-select form-control-lg bg-light shadow-sm border-0" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {catalogos.sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Región</label>
              <select className="form-select form-control-lg bg-light shadow-sm border-0" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange}>
                <option value="">Seleccione...</option>
                {catalogos.regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Comuna</label>
              <select className="form-select form-control-lg bg-light shadow-sm border-0" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange}>
                <option value="">Seleccione...</option>
                {comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}
              </select>
            </div>

            <div className="col-12 mt-4 pt-3 border-top">
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold fs-5 shadow-sm" disabled={cargando}>
                {cargando ? 'Creando...' : 'Guardar Nuevo Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCrearUsuarioAdmin;
