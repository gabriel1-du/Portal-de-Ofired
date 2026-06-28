import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Importar AuthContext
import { updateUsuario } from '../../servicios/usuariosService'; // Importar el servicio para actualizar usuario
import BarraBusqueda from '../../assets/barraBusqueda';
import '../../style/seccionPantallas/configPantalla.css'; // Importamos los estilos globales de configuración

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
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <BarraBusqueda />
      <div className="container-fluid d-flex align-items-center justify-content-center py-5">
        <main className="card shadow-sm border-0 rounded-4 p-4 p-md-5 w-100 position-relative bg-white tarjeta-config-media">
        
        {/* Botón Volver usando Bootstrap */}
        <button
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-texto"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mt-4 mb-4">
          <h1 className="fw-bolder text-dark fs-3 mb-2">Cambiar Correo</h1>
        </div>
        
        {error && <div className="alert alert-danger shadow-sm text-center">{error}</div>}

        <form onSubmit={handleCambiar}>
          <div className="mb-4">
            <label htmlFor="nuevoCorreo" className="form-label fw-bold text-dark">Ingrese nuevo correo</label>
            <input
              type="email"
              id="nuevoCorreo"
              className="form-control form-control-lg bg-light shadow-sm border-0"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              required
              placeholder="nuevo@correo.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmarCorreo" className="form-label fw-bold text-dark">Ingrese nuevamente</label>
            <input
              type="email"
              id="confirmarCorreo"
              className="form-control form-control-lg bg-light shadow-sm border-0"
              value={confirmarCorreo}
              onChange={(e) => setConfirmarCorreo(e.target.value)}
              required
              placeholder="nuevo@correo.com"
            />
          </div>

          <button
            type="submit"
            className="btn btn-naranja-config w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm mt-3"
            disabled={cargando}
          >
            {cargando ? 'Cambiando...' : 'Cambiar Correo'}
          </button>
        </form>
        </main>
      </div>
    </div>
  );
};

export default CambiarCorreoPantalla;