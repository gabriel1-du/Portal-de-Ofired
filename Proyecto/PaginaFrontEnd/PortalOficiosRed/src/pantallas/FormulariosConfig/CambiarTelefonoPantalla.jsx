import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import { updateUsuario } from '../../servicios/usuariosService'; 
import '../../style/seccionPantallas/configPantalla.css'; 

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
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <main className="card shadow-sm border-0 rounded-4 p-4 p-md-5 w-100 position-relative bg-white tarjeta-config-media">
        
        {/* Botón Volver */}
        <button
          className="btn btn-link text-decoration-none fw-bold p-0 position-absolute btn-volver-texto"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          &#10094; Volver
        </button>

        <div className="text-center mt-4 mb-4">
          <h1 className="fw-bolder text-dark fs-3 mb-2">Cambiar Teléfono</h1>
        </div>
        
        {error && <div className="alert alert-danger shadow-sm text-center">{error}</div>}

        <form onSubmit={handleCambiar}>
          <div className="mb-4">
            <label htmlFor="nuevoTelefono" className="form-label fw-bold text-dark">Ingrese nuevo teléfono</label>
            <input
              type="tel"
              id="nuevoTelefono"
              className="form-control form-control-lg bg-light shadow-sm border-0"
              value={nuevoTelefono}
              onChange={(e) => setNuevoTelefono(e.target.value)}
              required
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmarTelefono" className="form-label fw-bold text-dark">Ingrese nuevamente</label>
            <input
              type="tel"
              id="confirmarTelefono"
              className="form-control form-control-lg bg-light shadow-sm border-0"
              value={confirmarTelefono}
              onChange={(e) => setConfirmarTelefono(e.target.value)}
              required
              placeholder="+56 9 1234 5678"
            />
          </div>

          <button
            type="submit"
            className="btn btn-naranja-config w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm mt-3"
            disabled={cargando}
          >
            {cargando ? 'Cambiando...' : 'Cambiar Teléfono'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CambiarTelefonoPantalla;