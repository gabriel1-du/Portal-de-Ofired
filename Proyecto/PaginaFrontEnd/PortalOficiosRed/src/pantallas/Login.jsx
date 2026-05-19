
import React from 'react';
import { useNavigate } from 'react-router-dom';


import '../style/login.css';


function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="login-container">
      <h1>Bienvenido a Ofired</h1>
      <p>Un espacio para que tecnicos y profesionales compartan sus servicios y conocimientos</p>
      <div className="button-container">
        <button className="button-style" onClick={() => navigate('/iniciar-sesion')}>Iniciar Sesión</button>
        <button className="button-style" onClick={() => navigate('/crear-cuentOfi')}>Crear cuenta con Oficio</button>
        <button className="button-style" onClick={() => navigate('/crear-cuenta')}>Crear cuenta como cliente</button>
      </div>
    </div>
  );
}

export default Login;
