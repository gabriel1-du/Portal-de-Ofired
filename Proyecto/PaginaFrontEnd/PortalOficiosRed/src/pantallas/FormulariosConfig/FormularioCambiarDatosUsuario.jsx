import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUsuarioById, updateUsuario } from '../../servicios/usuariosService';
import { getAllRegions } from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllSexos } from '../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import { getAllOficios } from '../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import { validarRut } from '../../utils/verificaciones/verificacionRut';
import BarraBusqueda from '../../assets/barraBusqueda';
import '../../style/seccionPantallas/configPantalla.css';

const FormularioCambiarDatosUsuario = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSexoUsu: '',
    rut: '',
    idRegionUsu: '',
    idComunaUsu: '',
    idOficio: '',
    idTipoUsu: null,
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario || !usuario.idUsuario) {
      navigate('/iniciar-sesion');
      return;
    }

    const cargarDatos = async () => {
      try {
        const [datosUsuario, regionesData, comunasData, sexosData, oficiosData] = await Promise.all([
          getUsuarioById(usuario.idUsuario),
          getAllRegions(),
          getAllComunas(),
          getAllSexos(),
          getAllOficios(),
        ]);

        if (datosUsuario) {
          setFormData({
            primerNombre: datosUsuario.primerNombre || '',
            segundoNombre: datosUsuario.segundoNombre || '',
            primerApellido: datosUsuario.primerApellido || '',
            segundoApellido: datosUsuario.segundoApellido || '',
            idSexoUsu: datosUsuario.idSexoUsu || '',
            rut: datosUsuario.rut ? `${datosUsuario.rut}-${datosUsuario.rutDv}` : '',
            idRegionUsu: datosUsuario.idRegionUsu || '',
            idComunaUsu: datosUsuario.idComunaUsu || '',
            idOficio: datosUsuario.idOficio || '',
            idTipoUsu: datosUsuario.idTipoUsu,
          });
        }

        setRegiones(regionesData || []);
        setComunas(comunasData || []);
        setSexos(sexosData || []);
        setOficios(oficiosData || []);

      } catch (err) {
        setError("Error al cargar los datos iniciales.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario, navigate]);

  useEffect(() => {
    if (formData.idRegionUsu && comunas.length > 0) {
      const filtradas = comunas.filter(c => c.idRegion === parseInt(formData.idRegionUsu));
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.idRegionUsu, comunas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.idTipoUsu >= 2 && !validarRut(formData.rut)) {
      setError("El RUT ingresado no es válido.");
      return;
    }

    setCargando(true);
    try {
      const datosParaActualizar = { ...formData };
      if (formData.rut) {
        const rutLimpio = formData.rut.replace(/[^0-9kK]/g, '').toLowerCase();
        datosParaActualizar.rut = rutLimpio.slice(0, -1);
        datosParaActualizar.rutDv = rutLimpio.slice(-1);
      }

      await updateUsuario(usuario.idUsuario, datosParaActualizar, token);
      alert("Datos actualizados correctamente.");
      navigate('/configuracion');
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar los datos.");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <BarraBusqueda />
      <div className="text-center mt-5 pt-5 text-muted fst-italic">Cargando datos...</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <BarraBusqueda />
      <div className="container my-5 pt-4">
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mx-auto bg-white tarjeta-config-amplia position-relative">
        
        {/* Botón Volver usando Bootstrap */}
        <button
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-texto"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mb-5">
          <h1 className="fw-bolder text-dark fs-2 mb-3">Modificar Datos Personales</h1>
          <p className="text-muted">Actualiza tu información personal. Los cambios se reflejarán en tu perfil.</p>
        </div>
        
        {error && <div className="alert alert-danger shadow-sm text-center mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-12 col-md-6">
            <label htmlFor="primerNombre" className="form-label fw-bold text-dark">Primer Nombre:</label>
            <input type="text" id="primerNombre" name="primerNombre" className="form-control form-control-lg bg-light shadow-sm border-0" value={formData.primerNombre} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="segundoNombre" className="form-label fw-bold text-dark">Segundo Nombre:</label>
            <input type="text" id="segundoNombre" name="segundoNombre" className="form-control form-control-lg bg-light shadow-sm border-0" value={formData.segundoNombre} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="primerApellido" className="form-label fw-bold text-dark">Primer Apellido:</label>
            <input type="text" id="primerApellido" name="primerApellido" className="form-control form-control-lg bg-light shadow-sm border-0" value={formData.primerApellido} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="segundoApellido" className="form-label fw-bold text-dark">Segundo Apellido:</label>
            <input type="text" id="segundoApellido" name="segundoApellido" className="form-control form-control-lg bg-light shadow-sm border-0" value={formData.segundoApellido} onChange={handleChange} />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="idSexoUsu" className="form-label fw-bold text-dark">Sexo:</label>
            <select id="idSexoUsu" name="idSexoUsu" className="form-select form-control-lg bg-light shadow-sm border-0" value={formData.idSexoUsu} onChange={handleChange} required>
              <option value="">Selecciona un sexo</option>
              {sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}
            </select>
          </div>

          {/* Campos condicionales para usuario de oficio */}
          {formData.idTipoUsu >= 2 && (
            <>
              <div className="col-12 col-md-6">
                <label htmlFor="rut" className="form-label fw-bold text-dark">RUT:</label>
                <input id="rut" type="text" name="rut" className="form-control form-control-lg bg-light shadow-sm border-0" value={formData.rut} onChange={handleChange} required placeholder="Ej: 12345678-9" />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="idOficio" className="form-label fw-bold text-dark">Oficio:</label>
                <select id="idOficio" name="idOficio" className="form-select form-control-lg bg-light shadow-sm border-0" value={formData.idOficio} onChange={handleChange} required>
                  <option value="">Selecciona un oficio</option>
                  {oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="col-12 col-md-6">
            <label htmlFor="idRegionUsu" className="form-label fw-bold text-dark">Región:</label>
            <select id="idRegionUsu" name="idRegionUsu" className="form-select form-control-lg bg-light shadow-sm border-0" value={formData.idRegionUsu} onChange={handleChange} required>
              <option value="">Selecciona una región</option>
              {regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="idComunaUsu" className="form-label fw-bold text-dark">Comuna:</label>
            <select id="idComunaUsu" name="idComunaUsu" className="form-select form-control-lg bg-light shadow-sm border-0" value={formData.idComunaUsu} onChange={handleChange} disabled={!formData.idRegionUsu} required>
              <option value="">Selecciona una comuna</option>
              {comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}
            </select>
          </div>

          <div className="col-12 mt-5">
            <button type="submit" className="btn btn-naranja-config w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCambiarDatosUsuario;