import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getPerfilFrontByUsuarioId, updatePerfilUsuario } from '../../servicios/perfilesUsuarioService';
import { updateUsuario } from '../../servicios/usuariosService';
import '../../style/modificarPerfilUsuario.css';

const ModificarPerfilUsuario = () => {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [idPerfil, setIdPerfil] = useState(null);
  const [formData, setFormData] = useState({
    nombreApodo: '',
    fotografiaBanner: '',
    descripcion: '',
    foto: '' // Foto principal del usuario
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
            foto: datos.foto || ''
          });
          setIdPerfil(datos.idPerfilUsuario);
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
        // Aquí deberías subir el archivo a tu servidor/nube y obtener una URL.
        // Por ahora, usamos una URL de objeto como placeholder.
        setFormData(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardar = async () => {
    if (!idPerfil || !token || !usuario || !usuario.idUsuario) {
      setError("No se puede guardar: falta información crítica de usuario, perfil o autenticación.");
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

      // 2. Actualizar los datos del perfil (sin la foto).
      const datosPerfilParaActualizar = {
        idUsuario: usuario.idUsuario, // El backend podría necesitarlo para validación
        nombreApodo: formData.nombreApodo,
        fotografiaBanner: formData.fotografiaBanner,
        descripcion: formData.descripcion,
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

  if (cargando) return <div className="estado-mensaje">Cargando datos del perfil...</div>;
  if (error) return <div className="estado-mensaje error">{error}</div>;

  return (
    <div className="modificar-perfil-contenedor">
      <header className="modificar-perfil-header">
        <button className="btn-volver" aria-label="Volver" onClick={() => navigate(-1)}>
          &#10094;
        </button>
        <h1 className="titulo-modificar">Modifica tu perfil</h1>
      </header>

      <main className="modificar-perfil-tarjeta">
        <label className="input-area banner-area">
          <input type="file" accept="image/*" name="fotografiaBanner" className="input-archivo-oculto" onChange={handleChange} />
          
          {/* Si NO hay foto, mostramos el texto. Si SÍ hay, mostramos la imagen */}
          {!formData.fotografiaBanner ? (
            <span className="texto-placeholder">Ingresa la foto de tu banner</span>
          ) : (
            <img src={formData.fotografiaBanner} alt="Banner preview" className="preview-img" />
          )}
        </label>

        <div className="foto-perfil-seccion">
          <label className="input-area foto-area">
            <input type="file" accept="image/*" name="foto" className="input-archivo-oculto" onChange={handleChange} />
            <span className="icono-camara">📷</span>
            {formData.foto && <img src={formData.foto} alt="Perfil preview" className="preview-img" />}
          </label>
          <span className="texto-foto-lateral">Ingresa tu foto de perfil</span>
        </div>

        <div className="form-group-modificar">
          <label htmlFor="nombreApodo">Apodo:</label>
          <input type="text" id="nombreApodo" name="nombreApodo" value={formData.nombreApodo} onChange={handleChange} placeholder="Tu apodo o nombre profesional" />
        </div>

        <div className="descripcion-seccion">
          <textarea className="input-descripcion" name="descripcion" placeholder="Ingresa tu descripcion" maxLength={500} value={formData.descripcion} onChange={handleChange}></textarea>
        </div>

        <div className="acciones-seccion">
          <div className="aviso-configuracion">
            <span className="icono-aviso" aria-hidden="true">⚙️</span>
            <p className="texto-aviso">Para cambiar datos personales (nombre, correo), ve a <strong>Configuración de Cuenta</strong>.</p>
          </div>
          <button className="btn-guardar" aria-label="Guardar cambios" onClick={handleGuardar} disabled={cargando}>
            {cargando ? 'Guardando...' : '✓'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ModificarPerfilUsuario;