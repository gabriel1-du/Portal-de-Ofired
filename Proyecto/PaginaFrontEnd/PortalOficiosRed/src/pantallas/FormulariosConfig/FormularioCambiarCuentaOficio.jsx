import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAdminByIdAdmin, actualizarUsuarioAdmin } from '../../servicios/usuariosService';
import { getAllOficios } from '../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import { validarRut } from '../../utils/verificaciones/verificacionRut';
import '../../style/seccionPantallas/configPantalla.css';

const FormularioCambiarCuentaOficio = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSexoUsu: '',
    correoElec: '',
    rut: '',
    rutDv: '',
    numeroTelef: '',
    idRegionUsu: '',
    idComunaUsu: '',
    idOficio: '',
    idTipoUsu: 2,
    habilitadorAdministrador: false,
    foto: '',
  });

  const [oficios, setOficios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!usuario?.idUsuario || !token) {
      navigate('/iniciar-sesion');
      return;
    }

    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError('');

        const [datosUsuario, oficiosData] = await Promise.all([
          getAdminByIdAdmin(usuario.idUsuario),
          getAllOficios(),
        ]);

        if (!datosUsuario) {
          throw new Error('No se pudieron cargar los datos del usuario.');
        }

        if (Number(datosUsuario.idTipoUsu) !== 1) {
          setError('Esta opción solo está disponible para usuarios de tipo cliente.');
          return;
        }

        setFormData({
          primerNombre: datosUsuario.primerNombre || '',
          segundoNombre: datosUsuario.segundoNombre || '',
          primerApellido: datosUsuario.primerApellido || '',
          segundoApellido: datosUsuario.segundoApellido || '',
          idSexoUsu: datosUsuario.idSexo || '',
          correoElec: datosUsuario.correoElec || '',
          rut: datosUsuario.rut || '',
          rutDv: datosUsuario.rutDv || '',
          numeroTelef: datosUsuario.numeroTelef || '',
          idRegionUsu: datosUsuario.idRegion || '',
          idComunaUsu: datosUsuario.idComuna || '',
          idOficio: datosUsuario.idOficio || '',
          idTipoUsu: 2,
          habilitadorAdministrador: Boolean(datosUsuario.habilitadorAdministrador),
          foto: datosUsuario.foto || '',
        });

        setOficios(Array.isArray(oficiosData) ? oficiosData : []);
      } catch (err) {
        console.error('Error al cargar datos para cambio a usuario oficio:', err);
        setError(err.message || 'Error al cargar los datos del formulario.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuario, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'rut') {
      setFormData((prev) => ({
        ...prev,
        rut: value.replace(/[^0-9]/g, ''),
      }));
      return;
    }

    if (name === 'rutDv') {
      setFormData((prev) => ({
        ...prev,
        rutDv: value.replace(/[^0-9kK]/g, '').slice(0, 1).toUpperCase(),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const rutCompleto = `${formData.rut}-${formData.rutDv}`;

    if (!formData.rut || !formData.rutDv) {
      setError('Debes ingresar el RUT y su dígito verificador.');
      return;
    }

    if (!validarRut(rutCompleto)) {
      setError('El RUT ingresado no es válido.');
      return;
    }

    if (!formData.idOficio) {
      setError('Debes seleccionar un oficio.');
      return;
    }

    try {
      setGuardando(true);

      const datosParaActualizar = {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        idSexoUsu: Number(formData.idSexoUsu),
        correoElec: formData.correoElec,
        rut: formData.rut,
        rutDv: formData.rutDv,
        idTipoUsu: 2,
        habilitadorAdministrador: formData.habilitadorAdministrador,
        foto: formData.foto,
        numeroTelef: formData.numeroTelef,
        idRegionUsu: Number(formData.idRegionUsu),
        idComunaUsu: Number(formData.idComunaUsu),
        idOficio: Number(formData.idOficio),
      };

      await actualizarUsuarioAdmin(usuario.idUsuario, datosParaActualizar, token);

      setMensaje('Tu cuenta fue actualizada correctamente a usuario con oficio.');
      alert('Tu cuenta fue actualizada correctamente a usuario con oficio.');
      navigate('/configuracion');
    } catch (err) {
      console.error('Error al cambiar la cuenta a tipo oficio:', err);
      setError(err.message || 'Ocurrió un error al actualizar la cuenta.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="text-center mt-5 text-muted fst-italic">Cargando formulario...</div>;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mx-auto bg-white tarjeta-config-amplia position-relative">
        <button
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-texto"
          onClick={() => navigate('/configuracion')}
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mb-5">
          <h1 className="fw-bolder text-dark fs-2 mb-3">Cambiar Cuenta a Tipo Oficio</h1>
          <p className="text-muted">
            Completa tu RUT y selecciona un oficio para convertir tu cuenta de cliente en cuenta profesional.
          </p>
        </div>

        {error && <div className="alert alert-danger shadow-sm text-center mb-4">{error}</div>}
        {mensaje && <div className="alert alert-success shadow-sm text-center mb-4">{mensaje}</div>}

        {!error || Number(formData.idTipoUsu) === 2 ? (
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-12 col-md-6">
              <label htmlFor="primerNombre" className="form-label fw-bold text-dark">Primer Nombre:</label>
              <input
                type="text"
                id="primerNombre"
                className="form-control form-control-lg bg-light shadow-sm border-0"
                value={formData.primerNombre}
                readOnly
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="primerApellido" className="form-label fw-bold text-dark">Primer Apellido:</label>
              <input
                type="text"
                id="primerApellido"
                className="form-control form-control-lg bg-light shadow-sm border-0"
                value={formData.primerApellido}
                readOnly
              />
            </div>

            <div className="col-12">
              <label htmlFor="correoElec" className="form-label fw-bold text-dark">Correo Electrónico:</label>
              <input
                type="email"
                id="correoElec"
                className="form-control form-control-lg bg-light shadow-sm border-0"
                value={formData.correoElec}
                readOnly
              />
            </div>

            <div className="col-12 col-md-8">
              <label htmlFor="rut" className="form-label fw-bold text-dark">RUT:</label>
              <input
                type="text"
                id="rut"
                name="rut"
                className="form-control form-control-lg bg-light shadow-sm border-0"
                value={formData.rut}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="rutDv" className="form-label fw-bold text-dark">DV:</label>
              <input
                type="text"
                id="rutDv"
                name="rutDv"
                className="form-control form-control-lg bg-light shadow-sm border-0 text-uppercase"
                value={formData.rutDv}
                onChange={handleChange}
                placeholder="9 o K"
                required
                maxLength={1}
              />
            </div>

            <div className="col-12">
              <label htmlFor="idOficio" className="form-label fw-bold text-dark">Oficio:</label>
              <select
                id="idOficio"
                name="idOficio"
                className="form-select form-control-lg bg-light shadow-sm border-0"
                value={formData.idOficio}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un oficio</option>
                {oficios.map((oficio) => (
                  <option key={oficio.idOficio} value={oficio.idOficio}>
                    {oficio.nombreOficio}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-5">
              <button
                type="submit"
                className="btn btn-naranja-config w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm"
                disabled={guardando}
              >
                {guardando ? 'Actualizando cuenta...' : 'Cambiar a Usuario con Oficio'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <button
              type="button"
              className="btn btn-naranja-config rounded-pill px-4 py-2 fw-bold shadow-sm"
              onClick={() => navigate('/configuracion')}
            >
              Volver a Configuración
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioCambiarCuentaOficio;