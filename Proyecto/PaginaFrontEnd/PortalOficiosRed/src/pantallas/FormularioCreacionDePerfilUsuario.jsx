import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FormularioContext } from '../context/FormularioContext';
import { crearUsuarioCliente, crearUsuarioOficio } from '../servicios/usuariosService';
import { login } from '../servicios/ApiGateWay/authService';
import { createPerfilUsuario } from '../servicios/ApiUsuarios/perfilesUsuarioService';
import "../style/formularios/formularioCreacionPerfilUsuario.css";

const FormularioCreacionDePerfilUsuario = () => {
  
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
        // Guardamos el File real para la API y la URL para la previsualización local.
        updateFormData({ 
          [name]: file, 
          [`${name}Preview`]: URL.createObjectURL(file) 
        });
      }
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleFinalizarRegistro = async () => {
    setCargando(true);
    setError(null);

    try {
      let nuevoUsuario;

      // 1. Crear el Usuario según su tipo (cliente u oficio)
      if (formData.idTipoUsu === 2) {
        // --- Lógica para crear Usuario de Oficio ---
        const rutLimpio = formData.rut.replace(/[^0-9kK]/g, '').toLowerCase();
        const rutCuerpo = rutLimpio.slice(0, -1);
        const rutDv = rutLimpio.slice(-1);

        const datosUsuarioOficio = {
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre || null,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido || null,
          idSexoUsu: parseInt(formData.idSexoUsu),
          correoElec: formData.correoElec,
          password: formData.password,
          rut: rutCuerpo,
          rutDv: rutDv,
          numeroTelef: formData.numeroTelef,
          idTipoUsu: 2,
          foto: formData.foto || null,
          idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null,
          idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null,
          idOficio: formData.idOficio ? parseInt(formData.idOficio) : null,
        };
        nuevoUsuario = await crearUsuarioOficio(datosUsuarioOficio);
      } else {
        // --- Lógica para crear Usuario Cliente (la que ya existía) ---
        const datosUsuarioCliente = {
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre || null,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido || null,
          idSexoUsu: parseInt(formData.idSexoUsu),
          foto: formData.foto || null,
          correoElec: formData.correoElec,
          password: formData.password,
          numeroTelef: formData.numeroTelef,
          idTipoUsu: 1,
          idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null,
          idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null,
        };
        nuevoUsuario = await crearUsuarioCliente(datosUsuarioCliente);
      }

      // Verificamos que la respuesta del backend sea válida y contenga la propiedad 'idUsuario'
      if (!nuevoUsuario || !nuevoUsuario.idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario recién creado.");
      }

      // 2. Iniciar sesión automáticamente para obtener un token
      const loginResponse = await login({ email: formData.correoElec, password: formData.password });
      if (!loginResponse || !loginResponse.token) {
        throw new Error("Fallo al iniciar sesión automáticamente para crear el perfil.");
      }
      const token = loginResponse.token;

      // 3. Crear el Perfil de Usuario, ahora con el token de autorización
      const datosPerfilParaEnviar = {
        idUsuario: nuevoUsuario.idUsuario, // Ahora esto funciona porque la verificación anterior es correcta
        nombreApodo: formData.nombreApodo || null,
        fotografiaBanner: formData.fotografiaBanner || null,
        descripcion: formData.descripcion || null,
      };
      
      await createPerfilUsuario(datosPerfilParaEnviar, token);

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
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white w-100 position-relative" style={{ maxWidth: '800px' }}>
        
        {/* Botón Volver */}
        <button 
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-perfil" 
          onClick={() => navigate(-1)} 
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mb-5 mt-2 mt-md-0">
          <h1 className="fw-bolder text-dark fs-2 mb-3">Crea tu Perfil</h1>
        </div>

        {error && <div className="alert alert-danger text-center mb-4 shadow-sm">{error}</div>}
        
        {/* 1. Área del Banner (Replicado de ModificarPerfil) */}
        <label className="input-area border border-2 border-secondary border-opacity-25 rounded-4 d-flex align-items-center justify-content-center text-center overflow-hidden position-relative w-100 bg-light border-dashed mb-4" style={{ height: '200px' }}>
          <input type="file" accept="image/*" className="d-none" name="fotografiaBanner" onChange={handleChange} />
          {!formData.fotografiaBannerPreview && !formData.fotografiaBanner ? (
            <span className="text-secondary fw-semibold fs-5">Ingresa la foto de tu banner</span>
          ) : (
            <img src={formData.fotografiaBannerPreview || formData.fotografiaBanner} alt="Banner preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />
          )}
        </label>

        {/* 2. Área de la Foto de Perfil */}
        <div className="d-flex align-items-center mb-4 position-relative" style={{ marginTop: '-70px', marginLeft: '20px' }}>
          <label className="input-area bg-light border border-4 border-white rounded-circle shadow-sm d-flex align-items-center justify-content-center overflow-hidden position-relative flex-shrink-0" style={{ width: '130px', height: '130px', zIndex: 2 }}>
            <input type="file" accept="image/*" className="d-none" name="foto" onChange={handleChange} />
            <span className="fs-1">📷</span>
            {(formData.fotoPreview || formData.foto) && <img src={formData.fotoPreview || formData.foto} alt="Perfil preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />}
          </label>
          <span className="ms-3 mt-4 text-dark fw-bold fs-5">Ingresa tu foto de perfil</span>
        </div>
        
        {/* 3. Campo para el Apodo */}
        <div className="mb-4">
          <label htmlFor="nombreApodo" className="form-label fw-bold text-dark">Apodo:</label>
          <input type="text" id="nombreApodo" name="nombreApodo" className="form-control form-control-lg bg-light shadow-sm border-0 input-perfil" value={formData.nombreApodo || ''} onChange={handleChange} placeholder="Ej: El Maestro, Tu Ayudante" />
        </div>

        {/* 4. Área de Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="form-label fw-bold text-dark">Descripción:</label>
          <textarea className="form-control form-control-lg bg-light shadow-sm border-0 input-perfil" name="descripcion" placeholder="Ingresa tu descripción" rows="5" maxLength={500} value={formData.descripcion || ''} onChange={handleChange} style={{ resize: 'vertical' }}></textarea>
        </div>

        {/* Botón Finalizar Registro */}
        <div className="d-flex justify-content-end mt-5">
          <button className="btn text-white rounded-pill shadow-sm d-flex align-items-center justify-content-center px-4 py-3 btn-siguiente-perfil fw-bold fs-5" aria-label="Finalizar Registro" onClick={handleFinalizarRegistro} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Finalizar Registro 🚀'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormularioCreacionDePerfilUsuario;