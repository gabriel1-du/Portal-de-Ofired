import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioContext } from '../../../context/FormularioContext';
// import { crearUsuarioOficio } from '../../servicios/usuariosService'; // Ya no se usa aquí
import { getAllRegions } from '../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { getAllOficios } from '../../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import { getAllSexos } from '../../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import { validarRut } from '../../../utils/verificaciones/verificacionRut';
import '../../../style/home.css'; // Reutilizamos el CSS del Home para mantener el estilo visual

function FormularioCrearUsuarioOficio() {
  // Usamos el contexto para gestionar los datos del formulario
  const { formData, updateFormData } = useContext(FormularioContext);
  const navigate = useNavigate();

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Al entrar a este formulario, nos aseguramos que el tipo de usuario sea 'Oficio' (2)
    updateFormData({ idTipoUsu: 2 });

    const cargarDatos = async () => {
      try {
        const [regionesData, comunasData, oficiosData, sexosData] = await Promise.all([
          getAllRegions(),
          getAllComunas(),
          getAllOficios(),
          getAllSexos()
        ]);
        if (Array.isArray(regionesData)) {
          setRegiones(regionesData);
        }
        if (Array.isArray(comunasData)) {
          setComunas(comunasData);
        }
        if (Array.isArray(oficiosData)) {
          setOficios(oficiosData);
        }
        if (Array.isArray(sexosData)) {
          setSexos(sexosData);
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    cargarDatos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Efecto para filtrar comunas cuando se selecciona una región
  useEffect(() => {
    if (formData.idRegionUsu) {
      const filtradas = comunas.filter(
        (comuna) => comuna.idRegion === parseInt(formData.idRegionUsu)
      );
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.idRegionUsu, comunas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'idRegionUsu') {
      updateFormData({
        [name]: value,
        idComunaUsu: '', // Resetea la comuna
      });
    } else {
      updateFormData({
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrors({});

    // Validaciones
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.correoElec)) {
      newErrors.correoElec = 'El formato del correo electrónico no es válido.';
    }
    if (!validarRut(formData.rut)) {
      newErrors.rut = 'El RUT ingresado no es válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMensaje('Por favor, corrige los errores en el formulario.');
      return;
    }

    // Si las validaciones pasan, navegamos al siguiente paso.
    navigate('/crear-perfil');
  };

  return (
    <div className="home-container py-5">
      <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '700px', width: '100%', textAlign: 'left' }}>
        <h2 className="home-title text-center mb-3" style={{ fontSize: '2.5rem' }}>Crear Cuenta Profesional</h2>
        <p className="text-center text-muted mb-4">Completa tus datos para ofrecer tus servicios en nuestra plataforma.</p>
        
        {mensaje && <div className="alert alert-danger text-center shadow-sm">{mensaje}</div>}
        
        <form onSubmit={handleSubmit}>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="primerNombre" className="form-label fw-bold text-dark">Primer Nombre:</label>
              <input id="primerNombre" type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="segundoNombre" className="form-label fw-bold text-dark">Segundo Nombre:</label>
              <input id="segundoNombre" type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} className="form-control form-control-lg shadow-sm" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="primerApellido" className="form-label fw-bold text-dark">Primer Apellido:</label>
              <input id="primerApellido" type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="segundoApellido" className="form-label fw-bold text-dark">Segundo Apellido:</label>
              <input id="segundoApellido" type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="form-control form-control-lg shadow-sm" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="rut" className="form-label fw-bold text-dark">RUT:</label>
              <input id="rut" type="text" name="rut" value={formData.rut} onChange={handleChange} placeholder="Ej: 12345678-9" className={`form-control form-control-lg shadow-sm ${errors.rut ? 'is-invalid' : ''}`} required />
              {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="correoElec" className="form-label fw-bold text-dark">Correo Electrónico:</label>
              <input id="correoElec" type="email" name="correoElec" value={formData.correoElec} onChange={handleChange} className={`form-control form-control-lg shadow-sm ${errors.correoElec ? 'is-invalid' : ''}`} required />
              {errors.correoElec && <div className="invalid-feedback">{errors.correoElec}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label fw-bold text-dark">Contraseña:</label>
              <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="numeroTelef" className="form-label fw-bold text-dark">Número de Teléfono:</label>
              <input id="numeroTelef" type="tel" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idSexoUsu" className="form-label fw-bold text-dark">Sexo:</label>
              <select id="idSexoUsu" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} className="form-select form-control-lg shadow-sm" required>
                <option value="">Selecciona un sexo</option>
                {sexos.map((sexo) => (<option key={sexo.idSexo} value={sexo.idSexo}>{sexo.nombreSexo}</option>))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="idOficio" className="form-label fw-bold text-dark">Oficio:</label>
              <select id="idOficio" name="idOficio" value={formData.idOficio} onChange={handleChange} className="form-select form-control-lg shadow-sm" required>
                <option value="">Selecciona un oficio</option>
                {oficios.map((oficio) => (<option key={oficio.idOficio} value={oficio.idOficio}>{oficio.nombreOficio}</option>))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idRegionUsu" className="form-label fw-bold text-dark">Región:</label>
              <select id="idRegionUsu" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange} className="form-select form-control-lg shadow-sm" required>
                <option value="">Selecciona una región</option>
                {regiones.map((region) => (<option key={region.idRegion} value={region.idRegion}>{region.nombreRegion}</option>))}
              </select>
            </div>
            <div className="col-md-6 mb-4">
              <label htmlFor="idComunaUsu" className="form-label fw-bold text-dark">Comuna:</label>
              <select id="idComunaUsu" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} className="form-select form-control-lg shadow-sm" disabled={!formData.idRegionUsu}>
                <option value="">Selecciona una comuna</option>
                {comunasFiltradas.map((comuna) => (<option key={comuna.idComuna} value={comuna.idComuna}>{comuna.nombreComuna}</option>))}
              </select>
            </div>
          </div>

          <button type="submit" className="home-btn w-100 mt-2">Siguiente Paso</button>
        </form>
      </div>
    </div>
  );
}

export default FormularioCrearUsuarioOficio;