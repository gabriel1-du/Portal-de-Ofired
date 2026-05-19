import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { buscarChatPorUsuario } from '../servicios/chatService';
import ChatCard from '../assets/ChatCard';
import '../style/MisMensajesPantalla.css';

const MisMensajesPantalla = () => {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario || !token) {
      navigate('/iniciar-sesion');
      return;
    }

    const cargarChats = async () => {
      try {
        setCargando(true);
        const misChats = await buscarChatPorUsuario(usuario.idUsuario, token);
        setChats(misChats || []);
      } catch (err) {
        setError('Ocurrió un error al cargar tus mensajes.');
      } finally {
        setCargando(false);
      }
    };

    cargarChats();
  }, [usuario, token, navigate]);

  return (
    <div className="mis-mensajes-contenedor">
      <h1 className="titulo-mis-mensajes">Mis Mensajes</h1>
      
      {cargando && <p className="mensaje-estado">Cargando chats...</p>}
      {error && <p className="mensaje-estado error">{error}</p>}
      
      {!cargando && !error && chats.length === 0 && <p className="mensaje-estado">Aún no tienes conversaciones.</p>}

      {!cargando && !error && chats.length > 0 && (
        <div className="lista-chats">
          {chats.map(chat => <ChatCard key={chat.idChat} chat={chat} miId={usuario.idUsuario} />)}
        </div>
      )}
    </div>
  );
};

export default MisMensajesPantalla;
