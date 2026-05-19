import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUsuarioById, updateUsuario } from '../../servicios/usuariosService';
import { getAllRegions } from '../../servicios/regionService';
import { getAllComunas } from '../../servicios/comunasService';
import { getAllSexos } from '../../servicios/sexoService';
import { getAllOficios } from '../../servicios/oficioService';
import { validarRut } from '../../utils/verificaciones/verificacionRut';
import '../../style/FormularioCambiarDatosUsuario.css';

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

  if (cargando) return <p>Cargando datos...</p>;

  return (
    <div className="cambiar-datos-contenedor">
      <div className="cambiar-datos-header">
        <h1>Modificar Datos Personales</h1>
        <p>Actualiza tu información personal. Los cambios se reflejarán en tu perfil.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form className="form-container-datos" onSubmit={handleSubmit}>
        <div className="form-group-datos">
          <label htmlFor="primerNombre">Primer Nombre:</label>
          <input type="text" id="primerNombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required />
        </div>
        <div className="form-group-datos">
          <label htmlFor="segundoNombre">Segundo Nombre:</label>
          <input type="text" id="segundoNombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} />
        </div>
        <div className="form-group-datos">
          <label htmlFor="primerApellido">Primer Apellido:</label>
          <input type="text" id="primerApellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required />
        </div>
        <div className="form-group-datos">
          <label htmlFor="segundoApellido">Segundo Apellido:</label>
          <input type="text" id="segundoApellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} />
        </div>
        <div className="form-group-datos">
          <label htmlFor="idSexoUsu">Sexo:</label>
          <select id="idSexoUsu" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} required>
            <option value="">Selecciona un sexo</option>
            {sexos.map(s => <option key={s.idSexo} value={s.idSexo}>{s.nombreSexo}</option>)}
          </select>
        </div>

        {/* Campos condicionales para usuario de oficio */}
        {formData.idTipoUsu >= 2 && (
          <>
            <div className="form-group-datos">
              <label htmlFor="rut">RUT:</label>
              <input id="rut" type="text" name="rut" value={formData.rut} onChange={handleChange} required placeholder="Ej: 12345678-9" />
            </div>
            <div className="form-group-datos">
              <label htmlFor="idOficio">Oficio:</label>
              <select id="idOficio" name="idOficio" value={formData.idOficio} onChange={handleChange} required>
                <option value="">Selecciona un oficio</option>
                {oficios.map(o => <option key={o.idOficio} value={o.idOficio}>{o.nombreOficio}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="form-group-datos">
          <label htmlFor="idRegionUsu">Región:</label>
          <select id="idRegionUsu" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange} required>
            <option value="">Selecciona una región</option>
            {regiones.map(r => <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>)}
          </select>
        </div>
        <div className="form-group-datos">
          <label htmlFor="idComunaUsu">Comuna:</label>
          <select id="idComunaUsu" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} disabled={!formData.idRegionUsu} required>
            <option value="">Selecciona una comuna</option>
            {comunasFiltradas.map(c => <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>)}
          </select>
        </div>

        <button type="submit" className="form-submit-button" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default FormularioCambiarDatosUsuario;