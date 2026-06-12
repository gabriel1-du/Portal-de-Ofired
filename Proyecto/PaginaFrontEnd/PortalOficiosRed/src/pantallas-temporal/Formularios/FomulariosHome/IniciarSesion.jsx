import React, { useState, useContext, useEffect } from 'react';
import { login } from '../../../servicios/ApiGateWay/authService'; // Importa la función de login
import { AuthContext } from '../../../context/AuthContext'; // Importa el contexto de autenticación
import { jwtDecode } from 'jwt-decode'; // 1. Importamos la librería para decodificar el token
import { useNavigate } from 'react-router-dom';
import '../../../style/home.css'; // Reutilizamos el CSS del Home para mantener el mismo estilo visual

function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion, token, usuario } = useContext(AuthContext); // Extraemos token y usuario
  const navigate = useNavigate();

  // PROTECCIÓN: Si el usuario ya está logueado, lo redirigimos a la página principal
  useEffect(() => {
    if (token || usuario) {
      navigate('/home');
    }
  }, [token, usuario, navigate]);

  if (token || usuario) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes previos
    setError(''); // Limpiar errores previos

    try {
      const credenciales = { email, password };
      const data = await login(credenciales); // Llama a la función de login del servicio

      // Ahora, la respuesta solo contiene el token.
      if (data && data.token) {
        // 2. Decodificamos el token para obtener el payload (los datos del usuario)
        const decodedToken = jwtDecode(data.token);

        // Evaluamos si el claim "rol" indica que es administrador (soporta booleano true, texto 'true' o 'ADMIN')
        const esAdministrador = decodedToken.rol === true || String(decodedToken.rol).toLowerCase() === 'true' || String(decodedToken.rol).toUpperCase() === 'ADMIN';

        // 3. Creamos un objeto 'usuario' con los datos del token
        const usuarioParaContexto = {
          idUsuario: decodedToken.userId,
          username: decodedToken.username,
          rol: decodedToken.rol,
          habilitadorAdministrador: esAdministrador
        };

        // 4. Llamamos a iniciarSesion con el token y el objeto de usuario que acabamos de crear.
        iniciarSesion(data.token, usuarioParaContexto);
        setMensaje('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => {
          navigate('/home'); // Redirige a la página principal
        }, 2000); // Redirige después de 2 segundos
      } else {
        setError('Respuesta de login inválida. No se recibió un token.');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="home-container">
      <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '450px' }}>
        <h2 className="home-title text-center mb-4" style={{ fontSize: '2.5rem' }}>Iniciar Sesión</h2>
        
        {mensaje && <div className="alert alert-success text-center shadow-sm">{mensaje}</div>}
        {error && <div className="alert alert-danger text-center shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="text-start"> 
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold text-dark">Correo Electrónico:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg shadow-sm" placeholder="ejemplo@correo.com" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold text-dark">Contraseña:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg shadow-sm" placeholder="********" required />
          </div>
          <button type="submit" className="home-btn w-100 mt-2">Ingresar a mi cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;