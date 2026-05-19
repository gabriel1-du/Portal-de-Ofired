import React, { useState, useContext } from 'react';
import { login } from '../../servicios/authService'; // Importa la función de login
import { AuthContext } from '../../context/AuthContext'; // Importa el contexto de autenticación
import { jwtDecode } from 'jwt-decode'; // 1. Importamos la librería para decodificar el token
import { useNavigate } from 'react-router-dom';
import '../../style/inicioSesion.css'; // Importa el archivo CSS

function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useContext(AuthContext); // Obtiene la función iniciarSesion del contexto
  const navigate = useNavigate();

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
    <div className="form-container-login">
      <h2>Iniciar Sesión</h2>
      {mensaje && <p className="success-message-login">{mensaje}</p>}
      {error && <p className="error-message-login">{error}</p>}
      <form onSubmit={handleSubmit}> 
        <label htmlFor="email">Correo Electrónico:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-login" required />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-login" required />
        <button type="submit" className="button-login">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default IniciarSesion;