
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import '../style/home.css';


function Home() {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);

  useEffect(() => {
    // Si hay un token o datos de usuario, significa que ya tiene sesión iniciada.
    if (token || usuario) {
      navigate('/home'); // Lo redirigimos a PaginaHome.jsx
    }
  }, [token, usuario, navigate]);

  // Evitamos renderizar la pantalla si el usuario ya está siendo redirigido
  if (token || usuario) return null;
  
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a Ofired</h1>
      <p className="home-subtitle">Un espacio para que técnicos y profesionales compartan sus servicios y conocimientos</p>
      
      <div className="home-buttons-wrapper">
        <button className="home-btn" onClick={() => navigate('/iniciar-sesion')}>Iniciar Sesión</button>
        <button className="home-btn" onClick={() => navigate('/crear-cuentOfi')}>Crear cuenta con Oficio</button>
        <button className="home-btn" onClick={() => navigate('/crear-cuenta')}>Crear cuenta como cliente</button>
      </div>
    </div>
    
  );
}

export default Home;
