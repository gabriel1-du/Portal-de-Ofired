import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Importar AuthContext
import { updateUsuario } from '../../servicios/usuariosService'; // Importar el servicio para actualizar usuario
import '../../style/cambiarCorreoPantalla.css';

const CambiarCorreoPantalla = () => {
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext); // Obtener usuario y token del contexto

  // Estados para manejar los inputs de correo
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [confirmarCorreo, setConfirmarCorreo] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleCambiar = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError(null); // Limpiar errores previos

    if (!usuario || !usuario.idUsuario || !token) {
      setError("No se pudo verificar la sesión del usuario. Por favor, inicie sesión de nuevo.");
      return;
    }

    if (nuevoCorreo !== confirmarCorreo) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(nuevoCorreo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    setCargando(true);
    try {
      const datosParaActualizar = {
        correoElec: nuevoCorreo,
      };

      await updateUsuario(usuario.idUsuario, datosParaActualizar, token);
      alert("Correo electrónico actualizado exitosamente.");
      navigate('/configuracion'); // Volver a la pantalla de configuraciones
    } catch (err) {
      console.error("Error al cambiar el correo:", err);
      setError(err.message || "Ocurrió un error al intentar cambiar el correo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cambiar-correo-contenedor">
      {/* Botón Volver Flotante (overlapping the card edge) */}
      <button
        className="btn-volver-flotante"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        &#10094;
      </button>

      {/* Tarjeta Principal Centrada (Blanca con sombras suaves) */}
      <main className="correo-tarjeta">
        <h1 className="titulo-cambiar-correo">Cambiar Correo</h1>
        {error && <p className="error-message-correo">{error}</p>}

        <form className="form-correo" onSubmit={handleCambiar}>
          {/* 1. Ingrese nuevo correo */}
          <div className="form-group-correo">
            <label htmlFor="nuevoCorreo" className="label-correo">
              Ingrese nuevo correo
            </label>
            <input
              type="email"
              id="nuevoCorreo"
              name="nuevoCorreo"
              className="input-correo"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              required
              placeholder="nuevo@correo.com"
            />
          </div>

          {/* 2. Ingrese nuevamente */}
          <div className="form-group-correo">
            <label htmlFor="confirmarCorreo" className="label-correo">
              Ingrese nuevamente
            </label>
            <input
              type="email"
              id="confirmarCorreo"
              name="confirmarCorreo"
              className="input-correo"
              value={confirmarCorreo}
              onChange={(e) => setConfirmarCorreo(e.target.value)}
              required
              placeholder="nuevo@correo.com"
            />
          </div>

          {/* 3. Botón Cambiar (Centrado y de color Azul Moderno) */}
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

export default CambiarCorreoPantalla;