import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitarRecuperacionPassword } from '../../../servicios/ApiGateWay/recuperacionService'; // Importamos el servicio que creaste
import '../../../style/home.css'; // Reutilizamos el CSS del Home para mantener el mismo estilo visual

function SolicitarRecuperacion() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes previos
    setError(''); // Limpiar errores previos
    setCargando(true);

    try {
      // Llamamos a tu servicio de API Gateway
      await solicitarRecuperacionPassword(email);
      
      // Mostramos el mensaje exacto que solicitaste
      setMensaje('Te enviamos un correo electrónico con el enlace de recuperación.');
      
      // Redirigimos al inicio de sesión luego de 3 segundos
      setTimeout(() => {
        navigate('/iniciar-sesion');
      }, 3000);
    } catch (err) {
      console.error('Error al solicitar recuperación:', err);
      setError(err.message || 'Error al solicitar la recuperación. Verifica el correo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-buttons-wrapper" style={{ animationDelay: '0.2s', maxWidth: '450px' }}>
        <h2 className="home-title text-center mb-4" style={{ fontSize: '2.2rem' }}>Recuperar Contraseña</h2>
        <p className="text-center text-muted mb-4">Ingresa el correo electrónico asociado a tu cuenta.</p>
        
        {mensaje && <div className="alert alert-success text-center shadow-sm">{mensaje}</div>}
        {error && <div className="alert alert-danger text-center shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="text-start"> 
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold text-dark">Correo Electrónico:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg shadow-sm" placeholder="ejemplo@correo.com" required disabled={cargando} />
          </div>
          <button type="submit" className="home-btn w-100 mt-2" disabled={cargando}>{cargando ? 'Enviando correo...' : 'Enviar correo'}</button>
        </form>
      </div>
    </div>
  );
}

export default SolicitarRecuperacion;