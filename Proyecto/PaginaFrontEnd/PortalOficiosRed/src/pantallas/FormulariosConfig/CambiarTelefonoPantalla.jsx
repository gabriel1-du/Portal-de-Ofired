import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import { updateUsuario } from '../../servicios/usuariosService'; 
import '../../style/cambiarTelefonoPantalla.css';

const CambiarTelefonoPantalla = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext); 

  // Estados para manejar los inputs de teléfono
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [confirmarTelefono, setConfirmarTelefono] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleCambiar = async (e) => {
    e.preventDefault(); 
    setError(null); 

    if (!usuario || !usuario.idUsuario || !token) {
      setError("No se pudo verificar la sesión del usuario. Por favor, inicie sesión de nuevo.");
      return;
    }

    if (nuevoTelefono !== confirmarTelefono) {
      setError("Los números de teléfono no coinciden.");
      return;
    }

    // Validación básica para teléfonos: permite un '+' opcional y entre 8 a 15 dígitos
    const phoneRegex = /^[+]?[0-9]{8,15}$/;
    if (!phoneRegex.test(nuevoTelefono)) {
      setError("El formato del teléfono no es válido. Ingrese solo números (ej: +56912345678).");
      return;
    }

    setCargando(true);
    try {
      // Usamos la propiedad exacta de tu backend: numeroTelef
      const datosParaActualizar = {
        numeroTelef: nuevoTelefono,
      };

      await updateUsuario(usuario.idUsuario, datosParaActualizar, token); // Se añade el token aquí
      alert("Teléfono actualizado exitosamente.");
      navigate('/configuracion'); // Volver a la pantalla de configuraciones
    } catch (err) {
      console.error("Error al cambiar el teléfono:", err);
      setError(err.message || "Ocurrió un error al intentar cambiar el teléfono.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cambiar-telefono-contenedor">
      {/* Botón Volver Flotante */}
      <button
        className="btn-volver-flotante"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        &#10094;
      </button>

      {/* Tarjeta Principal Centrada */}
      <main className="telefono-tarjeta">
        <h1 className="titulo-cambiar-telefono">Cambiar Teléfono</h1>
        {error && <p className="error-message-telefono">{error}</p>}

        <form className="form-telefono" onSubmit={handleCambiar}>
          {/* 1. Ingrese nuevo teléfono */}
          <div className="form-group-telefono">
            <label htmlFor="nuevoTelefono" className="label-telefono">
              Ingrese nuevo teléfono
            </label>
            <input
              type="tel"
              id="nuevoTelefono"
              name="nuevoTelefono"
              className="input-telefono"
              value={nuevoTelefono}
              onChange={(e) => setNuevoTelefono(e.target.value)}
              required
              placeholder="+56 9 1234 5678"
            />
          </div>

          {/* 2. Ingrese nuevamente */}
          <div className="form-group-telefono">
            <label htmlFor="confirmarTelefono" className="label-telefono">
              Ingrese nuevamente
            </label>
            <input
              type="tel"
              id="confirmarTelefono"
              name="confirmarTelefono"
              className="input-telefono"
              value={confirmarTelefono}
              onChange={(e) => setConfirmarTelefono(e.target.value)}
              required
              placeholder="+56 9 1234 5678"
            />
          </div>

          {/* 3. Botón Cambiar */}
          <div className="boton-centrado-container">
            <button
              type="submit"
              className="btn-cambiar-principal"
              disabled={cargando}
            >
              {cargando ? 'Cambiando...' : 'Cambiar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CambiarTelefonoPantalla;