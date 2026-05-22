import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar al siguiente paso
import { FormularioContext } from '../../../context/FormularioContext'; // Importa el contexto del formulario
import { getAllRegions } from '../../../servicios/regionService'; // Importa la función para obtener regiones
import { getAllComunas } from '../../../servicios/comunasService'; // Importa la función para obtener comunas
import { getAllSexos } from '../../../servicios/sexoService'; // Importa la función para obtener sexos

import '../../../style/home.css'; // Reutilizamos el CSS del Home para mantener el estilo visual


function FormularioCrearUsuarioCliente() {
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');

  // Usamos el contexto para gestionar los datos del formulario
  const { formData, updateFormData } = useContext(FormularioContext);
  const navigate = useNavigate();


  useEffect(() => {
    // Al entrar, se limpia el estado para asegurar que es un registro de cliente.
    // Esto previene la "contaminación" de datos si antes se intentó un registro de oficio.
    updateFormData({ idTipoUsu: 1, rut: '', idOficio: '' });

    const cargarDatosGeograficos = async () => {
      try {
        const [regionesData, comunasData, sexosData] = await Promise.all([
          getAllRegions(),
          getAllComunas(),
          getAllSexos()
        ]);

        if (Array.isArray(regionesData)) {
          setRegiones(regionesData);
        }
        if (Array.isArray(comunasData)) {
          setComunas(comunasData);
        }
        if (Array.isArray(sexosData)) {
          setSexos(sexosData);
        }
      } catch (error) {
        console.error("Error al cargar datos geográficos:", error);
      }
    };
    cargarDatosGeograficos();
  }, []);

  // Efecto para filtrar las comunas cuando se selecciona una región
  useEffect(() => {
    if (formData.idRegionUsu) {
      const filtradas = comunas.filter(
        (comuna) => comuna.idRegion === parseInt(formData.idRegionUsu)
      );
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]); // Limpia las comunas si no hay región seleccionada
    }
  }, [formData.idRegionUsu, comunas]);

  // Función para manejar los cambios en los inputs
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setMensaje(''); // Limpia mensajes anteriores
    setErrors({}); // Limpia errores anteriores

    // Validaciones
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.correoElec)) {
      newErrors.correoElec = 'El formato del correo electrónico no es válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMensaje('Por favor, corrige los errores en el formulario.');
      return;
    }

    // Si las validaciones pasan, navegamos al siguiente paso.
    // Los datos ya están guardados en el contexto.
    navigate('/crear-perfil'); 
  };

  return (
    <div className="home-container py-5">
      <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '700px', width: '100%', textAlign: 'left' }}>
        <h2 className="home-title text-center mb-3" style={{ fontSize: '2.5rem' }}>Crear Cuenta</h2>
        <p className="text-center text-muted mb-4">Completa los siguientes datos para unirte como cliente.</p>
        
        {mensaje && <div className="alert alert-danger text-center shadow-sm">{mensaje}</div>} 
        
        <form onSubmit={handleSubmit}>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="primerNombre" className="form-label fw-bold text-dark">Primer Nombre:</label>
              <input type="text" id="primerNombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="segundoNombre" className="form-label fw-bold text-dark">Segundo Nombre:</label>
              <input type="text" id="segundoNombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} className="form-control form-control-lg shadow-sm" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="primerApellido" className="form-label fw-bold text-dark">Primer Apellido:</label>
              <input type="text" id="primerApellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="segundoApellido" className="form-label fw-bold text-dark">Segundo Apellido:</label>
              <input type="text" id="segundoApellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="form-control form-control-lg shadow-sm" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="idSexoUsu" className="form-label fw-bold text-dark">Sexo:</label>
            <select id="idSexoUsu" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} className="form-select form-control-lg shadow-sm" required>
              <option value="">Selecciona un sexo</option>
              {sexos.map((sexo) => (<option key={sexo.idSexo} value={sexo.idSexo}>{sexo.nombreSexo}</option>))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="correoElec" className="form-label fw-bold text-dark">Correo Electrónico:</label>
            <input type="email" id="correoElec" name="correoElec" value={formData.correoElec} onChange={handleChange} className={`form-control form-control-lg shadow-sm ${errors.correoElec ? 'is-invalid' : ''}`} required />
            {errors.correoElec && <div className="invalid-feedback">{errors.correoElec}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label fw-bold text-dark">Contraseña:</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="numeroTelef" className="form-label fw-bold text-dark">Número de Teléfono:</label>
              <input type="tel" id="numeroTelef" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} className="form-control form-control-lg shadow-sm" required />
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

export default FormularioCrearUsuarioCliente;