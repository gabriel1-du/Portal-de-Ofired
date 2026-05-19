import React, { useState, useContext } from 'react';
import { login } from '../../servicios/authService'; // Importa la función de login
import { AuthContext } from '../../context/AuthContext'; // Importa el contexto de autenticación
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

      // CORRECCIÓN: Ahora verificamos si el backend nos mandó el pase VIP (el token)
      if (data && data.token) {
        
        const tokenReal = data.token; // Guardamos el token real

        // Armamos un perfil básico para el navegador usando tu correo
        const usuarioParaContexto = {
          email: email,
          username: email.split('@')[0], // Saca tu nombre del correo (ej: diegotsimiranda)
          rol: 'USER', 
          habilitadorAdministrador: false
        };

        // El sistema guarda el token automáticamente sin que tú hagas nada manual
        iniciarSesion(tokenReal, usuarioParaContexto);
        
        setMensaje('Inicio de sesión exitoso. Redirigiendo...');
        
        setTimeout(() => {
          navigate('/home'); // Redirige a la página principal
        }, 2000); 
        
      } else {
        setError('Respuesta de login inválida. No se reconocieron los datos del usuario.');
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