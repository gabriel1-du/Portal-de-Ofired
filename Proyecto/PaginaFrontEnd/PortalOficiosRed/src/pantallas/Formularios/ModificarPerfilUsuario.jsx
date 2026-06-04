import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getPerfilFrontByUsuarioId, updatePerfilUsuario } from '../../servicios/ApiUsuarios/perfilesUsuarioService';
import { updateUsuario } from '../../servicios/usuariosService';
import '../../style/formularios/modificarPerfilUsuario.css';

const ModificarPerfilUsuario = () => {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [idPerfil, setIdPerfil] = useState(null);
  const [formData, setFormData] = useState({
    nombreApodo: '',
    fotografiaBanner: '',
    descripcion: '',
    foto: '', // Foto principal del usuario
    fotografiaBannerPreview: '',
    fotoPreview: ''
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario || !usuario.idUsuario) {
      setError("No se ha podido identificar al usuario. Por favor, inicie sesión de nuevo.");
      setCargando(false);
      setTimeout(() => navigate('/iniciar-sesion'), 3000);
      return;
    }

    const cargarDatosPerfil = async () => {
      try {
        const datos = await getPerfilFrontByUsuarioId(usuario.idUsuario);
        if (datos) {
          setFormData({
            nombreApodo: datos.nombreApodo || '',
            fotografiaBanner: datos.fotografiaBanner || '',
            descripcion: datos.descripcion || '',
            foto: datos.foto || '',
            fotografiaBannerPreview: '',
            fotoPreview: ''
          });
          // Aseguramos capturar el ID sin importar cómo lo haya nombrado el backend
          setIdPerfil(datos.idPerfilUsuario || datos.idPerfil || datos.id);
        } else {
          setError("No se encontró un perfil para modificar. Es posible que necesites crear uno primero.");
        }
      } catch (err) {
        setError("Error al cargar los datos del perfil.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosPerfil();
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Guardamos el File real para la API y la URL temporal para la previsualización
        setFormData(prev => ({ 
          ...prev, 
          [name]: file,
          [`${name}Preview`]: URL.createObjectURL(file) 
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardar = async () => {
    if (!idPerfil || !token || !usuario || !usuario.idUsuario) {
      console.error("Fallo de validación. Datos detectados:", { idPerfil, tieneToken: !!token, idUsuario: usuario?.idUsuario });
      setError(`No se puede guardar. Falta información: ${!idPerfil ? 'ID del Perfil. ' : ''}${!token ? 'Token de Sesión. ' : ''}${!usuario?.idUsuario ? 'ID de Usuario.' : ''}`);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // 1. Actualizar la foto en la entidad Usuario.
      const datosFotoUsuario = {
        foto: formData.foto,
      };
      await updateUsuario(usuario.idUsuario, datosFotoUsuario, token);

      // 2. Actualizar los datos del perfil (ajustado exactamente al PerfilUsuarioActualizarDTO).
      const datosPerfilParaActualizar = {
        nombreApodo: formData.nombreApodo,
        descripcion: formData.descripcion,
        fotografiaBanner: formData.fotografiaBanner
      };
      await updatePerfilUsuario(idPerfil, datosPerfilParaActualizar, token);

      alert("Perfil actualizado con éxito.");
      navigate(`/perfil/${usuario.idUsuario}`); // Volver al perfil actualizado

    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar los cambios.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="text-center mt-5 text-muted fst-italic">Cargando datos del perfil...</div>;
  if (error) return <div className="alert alert-danger text-center m-5 shadow-sm">{error}</div>;

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white w-100 position-relative" style={{ maxWidth: '800px' }}>
        
        {/* Botón Volver usando Bootstrap y la clase personalizada */}
        <button 
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-perfil" 
          onClick={() => navigate(-1)} 
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mb-5 mt-2 mt-md-0">
          <h1 className="fw-bolder text-dark fs-2 mb-3">Modifica tu perfil</h1>
        </div>

        <label className="input-area border border-2 border-secondary border-opacity-25 rounded-4 d-flex align-items-center justify-content-center text-center overflow-hidden position-relative w-100 bg-light border-dashed mb-4" style={{ height: '200px' }}>
          <input type="file" accept="image/*" name="fotografiaBanner" className="d-none" onChange={handleChange} />
          
          {!formData.fotografiaBannerPreview && !formData.fotografiaBanner ? (
            <span className="text-secondary fw-semibold fs-5">Ingresa la foto de tu banner</span>
          ) : (
            <img src={formData.fotografiaBannerPreview || formData.fotografiaBanner} alt="Banner preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />
          )}
        </label>

        <div className="d-flex align-items-center mb-4 position-relative" style={{ marginTop: '-70px', marginLeft: '20px' }}>
          <label className="input-area bg-light border border-4 border-white rounded-circle shadow-sm d-flex align-items-center justify-content-center overflow-hidden position-relative flex-shrink-0" style={{ width: '130px', height: '130px', zIndex: 2 }}>
            <input type="file" accept="image/*" name="foto" className="d-none" onChange={handleChange} />
            <span className="fs-1">📷</span>
            {(formData.fotoPreview || formData.foto) && <img src={formData.fotoPreview || formData.foto} alt="Perfil preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />}
          </label>
          <span className="ms-3 mt-4 text-dark fw-bold fs-5">Ingresa tu foto de perfil</span>
        </div>

        <div className="mb-4">
          <label htmlFor="nombreApodo" className="form-label fw-bold text-dark">Apodo:</label>
          <input type="text" id="nombreApodo" name="nombreApodo" className="form-control form-control-lg bg-light shadow-sm border-0 input-perfil" value={formData.nombreApodo} onChange={handleChange} placeholder="Tu apodo o nombre profesional" />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="form-label fw-bold text-dark">Descripción:</label>
          <textarea className="form-control form-control-lg bg-light shadow-sm border-0 input-perfil" name="descripcion" placeholder="Ingresa tu descripción" rows="5" maxLength={500} value={formData.descripcion} onChange={handleChange} style={{ resize: 'vertical' }}></textarea>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 gap-4">
          <div className="alert border-0 rounded-3 d-flex align-items-center flex-grow-1 m-0 shadow-sm w-100" style={{ backgroundColor: '#fdf6ec', borderLeft: '4px solid #f3961c' }}>
            <span className="fs-4 me-3" aria-hidden="true">⚙️</span>
            <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>Para cambiar datos personales (nombre, correo), ve a <strong className="text-dark">Configuración de Cuenta</strong>.</p>
          </div>
          
          <button className="btn text-white rounded-circle shadow-sm d-flex align-items-center justify-content-center flex-shrink-0 btn-guardar-perfil" aria-label="Guardar cambios" onClick={handleGuardar} disabled={cargando}>
            {cargando ? 'Guardando...' : '✓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModificarPerfilUsuario;