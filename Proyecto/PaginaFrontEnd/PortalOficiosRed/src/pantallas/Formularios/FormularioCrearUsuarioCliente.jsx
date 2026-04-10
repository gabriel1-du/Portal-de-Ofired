import React from 'react';
import { useState } from 'react';
import { crearUsuarioCliente } from '../../servicios/usuariosService'; // Importa la función del servicio

function FormularioCrearUsuarioCliente() {
  // Estilos básicos en línea para que el formulario sea legible por ahora
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    marginBottom: '5px',
    marginTop: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
  };

  const inputStyle = {
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  };

  // Estado para cada campo del formulario
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSexoUsu: '',
    foto: '',
    correoElec: '',
    password: '',
    numeroTelef: '',
    idTipoUsu: '',
    idRegionUsu: '',
    idComunaUsu: '',
  });

  const [mensaje, setMensaje] = useState('');

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setMensaje(''); // Limpia mensajes anteriores

    // Construye el objeto con los datos del formulario, asegurando los tipos correctos
    const datosParaEnviar = {
      primerNombre: formData.primerNombre,
      segundoNombre: formData.segundoNombre || null, // Opcional
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido || null, // Opcional
      idSexoUsu: parseInt(formData.idSexoUsu),
      foto: formData.foto || null, // Opcional
      correoElec: formData.correoElec,
      password: formData.password,
      numeroTelef: formData.numeroTelef,
      idTipoUsu: parseInt(formData.idTipoUsu),
      idRegionUsu: formData.idRegionUsu ? parseInt(formData.idRegionUsu) : null, // Opcional
      idComunaUsu: formData.idComunaUsu ? parseInt(formData.idComunaUsu) : null, // Opcional
    };

    try {
      const response = await crearUsuarioCliente(datosParaEnviar);
      if (response) {
        setMensaje('¡Usuario creado exitosamente!');
        // Opcional: Limpiar el formulario después del éxito
        setFormData({
          primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
          idSexoUsu: '', foto: '', correoElec: '', password: '', numeroTelef: '',
          idTipoUsu: '', idRegionUsu: '', idComunaUsu: '',
        });
      } else {
        setMensaje('Error al crear el usuario. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      setMensaje('Ocurrió un error inesperado. Por favor, inténtalo más tarde.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Crear Cuenta de Usuario</h1>
      <p>Por favor, completa los siguientes datos para crear tu cuenta.</p>
      {mensaje && <p>{mensaje}</p>} {/* Muestra el mensaje de estado */}
      <form style={formStyle} onSubmit={handleSubmit}>
        <label htmlFor="primerNombre" style={labelStyle}>Primer Nombre:</label>
        <input type="text" id="primerNombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="segundoNombre" style={labelStyle}>Segundo Nombre:</label>
        <input type="text" id="segundoNombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} style={inputStyle} />
        <label htmlFor="primerApellido" style={labelStyle}>Primer Apellido:</label>
        <input type="text" id="primerApellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="segundoApellido" style={labelStyle}>Segundo Apellido:</label>
        <input type="text" id="segundoApellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} style={inputStyle} />
        <label htmlFor="idSexoUsu" style={labelStyle}>ID Sexo:</label>
        <input type="number" id="idSexoUsu" name="idSexoUsu" value={formData.idSexoUsu} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="foto" style={labelStyle}>URL de la Foto:</label>
        <input type="text" id="foto" name="foto" value={formData.foto} onChange={handleChange} style={inputStyle} placeholder="https://ejemplo.com/tu-foto.jpg" />
        <label htmlFor="correoElec" style={labelStyle}>Correo Electrónico:</label>
        <input type="email" id="correoElec" name="correoElec" value={formData.correoElec} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="password" style={labelStyle}>Contraseña:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="numeroTelef" style={labelStyle}>Número de Teléfono:</label>
        <input type="tel" id="numeroTelef" name="numeroTelef" value={formData.numeroTelef} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="idTipoUsu" style={labelStyle}>ID Tipo de Usuario:</label>
        <input type="number" id="idTipoUsu" name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange} style={inputStyle} required />
        <label htmlFor="idRegionUsu" style={labelStyle}>ID Región (Opcional):</label>
        <input type="number" id="idRegionUsu" name="idRegionUsu" value={formData.idRegionUsu} onChange={handleChange} style={inputStyle} />
        <label htmlFor="idComunaUsu" style={labelStyle}>ID Comuna (Opcional):</label>
        <input type="number" id="idComunaUsu" name="idComunaUsu" value={formData.idComunaUsu} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Registrarse</button>
      </form>
    </div>
  );
}

export default FormularioCrearUsuarioCliente;