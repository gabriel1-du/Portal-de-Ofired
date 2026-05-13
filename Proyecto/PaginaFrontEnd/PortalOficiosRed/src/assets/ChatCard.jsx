import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatCard.css';

const ChatCard = ({ chat, miId }) => {
  const navigate = useNavigate();
  
  // Determinamos quién es el "otro" usuario para mostrar su info
  const esElUsuario1 = chat.idUsuario1 === miId;
  const otroId = esElUsuario1 ? chat.idUsuario2 : chat.idUsuario1;
  
  // Extraemos exactamente el nombre del otro usuario usando los nuevos campos del backend
  const otroNombre = esElUsuario1 ? chat.nombreUsuario2 : chat.nombreUsuario1;
  const otraFoto = esElUsuario1 ? chat.fotoUsuario2 : chat.fotoUsuario1;
  
  // Validamos si la foto viene vacía o con una "N" (default)
  const fotoAMostrar = otraFoto && otraFoto !== "N" && otraFoto !== "" 
    ? otraFoto 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(otroNombre)}&background=03a9f4&color=fff`;

  return (
    <div className="chat-card-contenedor" onClick={() => navigate(`/chat/${chat.idChat}`)}>
      <img src={fotoAMostrar} alt={`Avatar de ${otroNombre}`} className="chat-card-avatar" />
      <div className="chat-card-info">
        <h3 className="chat-card-nombre">{otroNombre}</h3>
      </div>
    </div>
  );
};

export default ChatCard;
