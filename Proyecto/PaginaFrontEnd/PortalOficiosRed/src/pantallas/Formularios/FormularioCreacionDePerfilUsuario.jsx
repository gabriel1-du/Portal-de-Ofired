import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioContext } from '../../context/FormularioContext';
import { crearUsuarioCliente } from '../../servicios/usuariosService'; // Para crear el usuario
import { createPerfilUsuario } from '../../servicios/perfilesUsuarioService'; // Para crear el perfil
import '../../style/formularioCreacionPerfilUsuario.css';

const FormularioCreacionDePerfilUsuario= () => {
  const { formData, updateFormData, resetFormData } = useContext(FormularioContext);
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Se crea una URL local para el archivo seleccionado.
        // Esto es temporal hasta que se conecte a un servicio de almacenamiento en la nube.
        // Guardamos la URL temporal en el contexto.
        updateFormData({ [name]: URL.createObjectURL(file) });
      }
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleFinalizarRegistro = async () => {
    setCargando(true);
    setError(null);

    try {
      // 1. Crear el Usuario
      const datosUsuarioParaEnviar = {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido || null,
        idSexoUsu: parseInt(formData.idSexoUsu),
        foto: formData.foto || null, // La foto de perfil ahora viene de este formulario
        correoElec: formData.correoElec,
        password: formData.password,
        numeroTelef: formData.numeroTelef,
        idTipoUsu: formData.idTipoUsu, // Ya viene del contexto (1 para cliente)
        idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null,
        idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null,
      };

      const nuevoUsuario = await crearUsuarioCliente(datosUsuarioParaEnviar);
      // Verificamos que la respuesta del backend sea válida y contenga la propiedad 'idUsuario'
      if (!nuevoUsuario || !nuevoUsuario.idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario recién creado.");
      }

      // 2. Crear el Perfil de Usuario
      const datosPerfilParaEnviar = {
        idUsuario: nuevoUsuario.idUsuario, // Ahora esto funciona porque la verificación anterior es correcta
        nombreApodo: formData.nombreApodo || null,
        fotografiaBanner: formData.fotografiaBanner || null,
        descripcion: formData.descripcion || null,
      };

      await createPerfilUsuario(datosPerfilParaEnviar);

      // Si todo fue exitoso
      resetFormData(); // Limpiamos el contexto
      navigate('/iniciar-sesion'); // Redirigimos al login
      alert('¡Cuenta creada exitosamente! Por favor, inicia sesión.');

    } catch (err) {
      console.error("Error en el proceso de registro:", err);
      setError(err.message || "Ocurrió un error al finalizar el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="crear-perfil-contenedor">
      
      {/* Cabecera con botón de volver y título */}
      <header className="crear-perfil-header">
        <button className="btn-volver" aria-label="Volver" onClick={() => navigate(-1)}>
          &#10094; {/* Símbolo de flecha izquierda */}
        </button>
        <h1 className="titulo-crear">Crea tu Perfil</h1>
      </header>

      {/* Tarjeta principal del formulario */}
      <main className="crear-perfil-tarjeta">
        {error && <p className="error-message">{error}</p>}
        
        {/* 1. Área del Banner */}
        <label className="input-area banner-area">
          <input 
            type="file" 
            accept="image/*" 
            className="input-archivo-oculto"
            name="fotografiaBanner"
            onChange={handleChange}
          />
          <span className="texto-placeholder">Ingresa la foto de tu banner</span>
        </label>

        {/* 2. Área de la Foto de Perfil (Principal) */}
        <div className="foto-perfil-seccion">
          <label className="input-area foto-area">
            <input 
              type="file" 
              accept="image/*" 
              className="input-archivo-oculto"
              name="foto" // Este es el campo 'foto' para el usuario
              onChange={handleChange}
            />
            {/* Ícono de imagen/cámara por defecto */}
            <span className="icono-camara">📷</span>
          </label>
          <span className="texto-foto-lateral">Ingresa tu foto de perfil</span>
        </div>
        
        {/* 3. Campo para el Apodo */}
        <div className="form-group">
          <label htmlFor="nombreApodo">Apodo:</label>
          <input 
            type="text" 
            id="nombreApodo" 
            name="nombreApodo" 
            value={formData.nombreApodo} 
            onChange={handleChange} 
            placeholder="Ej: El Maestro, Tu Ayudante"
          />
        </div>

        {/* 4. Área de Descripción */}
        <div className="descripcion-seccion">
          <textarea 
            className="input-descripcion"
            name="descripcion"
            placeholder="Ingresa tu descripcion"
            maxLength={500} // El límite que acordamos para la base de datos
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Botón Finalizar Registro */}
        <div className="acciones-seccion">
          <button className="btn-siguiente" aria-label="Finalizar Registro" onClick={handleFinalizarRegistro} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Finalizar Registro'}
            &#10095; {/* Símbolo de flecha derecha */}
          </button>
        </div>

      </main>
    </div>
  );
};

export default FormularioCreacionDePerfilUsuario;