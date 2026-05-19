import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioContext } from '../../context/FormularioContext';
// import { crearUsuarioOficio } from '../../servicios/usuariosService'; // Ya no se usa aquí
import { getAllRegions } from '../../servicios/regionService';
import { getAllComunas } from '../../servicios/comunasService';
import { getAllOficios } from '../../servicios/oficioService';
import { getAllSexos } from '../../servicios/sexoService';
import { validarRut } from '../../utils/verificaciones/verificacionRut';
import '../../style/formulacioCreacionUsuario.css'; // Importa el CSS compartido

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
    <div style={{ textAlign: 'center' }}>
      <h1>Crear Cuenta de Profesional</h1>
      <p>Completa tus datos para ofrecer tus servicios en nuestra plataforma.</p>
      {mensaje && <p>{mensaje}</p>}
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="primerNombre">Primer Nombre:</label>
          <input id="primerNombre" type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="segundoNombre">Segundo Nombre:</label>
          <input id="segundoNombre" type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="primerApellido">Primer Apellido:</label>
          <input id="primerApellido" type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="segundoApellido">Segundo Apellido:</label>
          <input id="segundoApellido" type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="rut">RUT:</label>
          <input id="rut" type="text" name="rut" value={formData.rut} onChange={handleChange} required placeholder="Ej: 12345678-9" />
          {errors.rut && <p className="error-message">{errors.rut}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="correoElec">Correo Electrónico:</label>
          <input id="correoElec" type="email" name="correoElec" value={formData.correoElec} onChange={handleChange} required />
          {errors.correoElec && <p className="error-message">{errors.correoElec}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="numeroTelef">Número de Teléfono:</label>
          <input id="numeroTelef" type="tel" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="idSexoUsu">Sexo:</label>
          <select id="idSexoUsu" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} required>
            <option value="">Selecciona un sexo</option>
            {sexos.map((sexo) => (
              <option key={sexo.idSexo} value={sexo.idSexo}>
                {sexo.nombreSexo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="idOficio">Oficio:</label>
          <select id="idOficio" name="idOficio" value={formData.idOficio} onChange={handleChange} required>
            <option value="">Selecciona un oficio</option>
            {oficios.map((oficio) => (
              <option key={oficio.idOficio} value={oficio.idOficio}>
                {oficio.nombreOficio}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="idRegionUsu">Región:</label>
          <select id="idRegionUsu" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange} required>
            <option value="">Selecciona una región</option>
            {regiones.map((region) => (
              <option key={region.idRegion} value={region.idRegion}>
                {region.nombreRegion}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="idComunaUsu">Comuna:</label>
          <select id="idComunaUsu" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} disabled={!formData.idRegionUsu}>
            <option value="">Selecciona una comuna</option>
            {comunasFiltradas.map((comuna) => (
              <option key={comuna.idComuna} value={comuna.idComuna}>
                {comuna.nombreComuna}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="form-submit-button">Siguiente</button>
      </form>
    </div>
  );
}

export default FormularioCrearUsuarioOficio;