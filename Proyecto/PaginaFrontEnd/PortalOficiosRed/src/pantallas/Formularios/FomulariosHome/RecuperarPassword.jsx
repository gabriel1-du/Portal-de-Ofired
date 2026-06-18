import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUsuarioById, updateUsuario } from '../../../servicios/usuariosService';
import '../../../style/home.css';

function RecuperarPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);
  const [usuarioDatos, setUsuarioDatos] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      setError('Token de recuperación no válido o expirado.');
      return;
    }

    try {
      // Decodificar el token
      const decodedToken = jwtDecode(token);
      
      // Obtener el usuario para tener sus datos completos
      const obtenerUsuario = async () => {
        try {
          const usuario = await getUsuarioById(decodedToken.userId);
          setUsuarioDatos(usuario);
        } catch (err) {
          console.error('Error al obtener usuario:', err);
          setError('Error al procesar la solicitud.');
        }
      };
      
      obtenerUsuario();
    } catch (err) {
      console.error('Token inválido:', err);
      setTokenValido(false);
      setError('Token de recuperación no válido o expirado.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      // Crear los datos del usuario con la nueva contraseña
      const usuarioParaActualizar = {
        ...usuarioDatos,
        password: password
      };

      // Actualizar el usuario usando el token de recuperación
      await updateUsuario(usuarioDatos.idUsuario, usuarioParaActualizar, token);

      // Mostrar alert de éxito
      alert('Contraseña exitosamente creada');
      
      // Redirigir a iniciar sesión
      navigate('/iniciar-sesion');
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      setError(err.message || 'Error al actualizar la contraseña. Inténtalo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="home-container">
        <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '450px' }}>
          <h2 className="home-title text-center mb-4" style={{ fontSize: '2.2rem' }}>Recuperar Contraseña</h2>
          {error && <div className="alert alert-danger text-center shadow-sm">{error}</div>}
          <button 
            className="home-btn w-100 mt-4" 
            onClick={() => navigate('/iniciar-sesion')}
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '450px' }}>
        <h2 className="home-title text-center mb-4" style={{ fontSize: '2.2rem' }}>Establecer Nueva Contraseña</h2>
        <p className="text-center text-muted mb-4">Ingresa tu nueva contraseña.</p>
        
        {mensaje && <div className="alert alert-success text-center shadow-sm">{mensaje}</div>}
        {error && <div className="alert alert-danger text-center shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="text-start"> 
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold text-dark">Nueva Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-control form-control-lg shadow-sm" 
              placeholder="********" 
              required 
              disabled={cargando} 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmarPassword" className="form-label fw-bold text-dark">Confirmar Contraseña:</label>
            <input 
              type="password" 
              id="confirmarPassword" 
              value={confirmarPassword} 
              onChange={(e) => setConfirmarPassword(e.target.value)} 
              className="form-control form-control-lg shadow-sm" 
              placeholder="********" 
              required 
              disabled={cargando} 
            />
          </div>
          <button 
            type="submit" 
            className="home-btn w-100 mt-2" 
            disabled={cargando}
          >
            {cargando ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarPassword;