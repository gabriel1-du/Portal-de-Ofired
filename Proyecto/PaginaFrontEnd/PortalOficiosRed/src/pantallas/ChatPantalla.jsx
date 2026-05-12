import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { leerMensajesPorChat, crearMensaje } from '../servicios/mensajesChatService';
import { leerTodosLosParticipantesFront } from '../servicios/participantesChatService';
import MensajeCard from '../assets/MensajeCard';
import '../style/ChatPantalla.css';

const ChatPantalla = () => {
  const { idChat } = useParams();
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  const [mensajes, setMensajes] = useState([]);
  const [otroParticipante, setOtroParticipante] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario || !token) {
      navigate('/iniciar-sesion');
      return;
    }
    cargarDatosChat();
  }, [idChat, usuario]);

  const cargarDatosChat = async () => {
    try {
      setCargando(true);
      // 1. Obtener participantes para la cabecera (Cruzando tokens para saber quién es quién)
      const todosParticipantes = await leerTodosLosParticipantesFront(token);
      const participantesChat = todosParticipantes.filter(p => p.idChat === parseInt(idChat));
      
      // Verificación importante: saber quién es el otro (Diferente a mi ID)
      const elOtro = participantesChat.find(p => p.idUsuario !== usuario.idUsuario);
      setOtroParticipante(elOtro);

      // 2. Obtener los mensajes del historial
      await cargarSoloMensajes();
    } catch (error) {
      console.error("Error al cargar la sala de chat:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarSoloMensajes = async () => {
    try {
      const msjs = await leerMensajesPorChat(idChat, token);
      setMensajes(msjs || []);
    } catch (error) {
      console.error("Error al recargar mensajes:", error);
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    
    try {
      const dtoMensaje = {
        mensajeTexto: nuevoMensaje.trim(),
        idChat: parseInt(idChat),
        idAutor: usuario.idUsuario
      };
      
      await crearMensaje(dtoMensaje, token);
      setNuevoMensaje('');
      
      // Recargamos el historial inmediatamente después del post
      await cargarSoloMensajes();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  if (cargando) return <div className="chat-cargando">Cargando conversación...</div>;

  return (
    <div className="chat-pantalla-principal">
      {/* HEADER DEL CHAT */}
      <header className="chat-header">
        <button className="chat-btn-volver" onClick={() => navigate(-1)}>&#10094;</button>
        {otroParticipante && (
          <div className="chat-info-usuario">
            <img 
              src={otroParticipante.fotoUsuario || `https://ui-avatars.com/api/?name=${otroParticipante.nombreUsuario?.replace(' ', '+')}&background=03a9f4&color=fff`} 
              alt="Avatar" 
              className="chat-avatar-header" 
            />
            <h2 className="chat-nombre-header">{otroParticipante.nombreUsuario}</h2>
          </div>
        )}
      </header>

      {/* ÁREA DE MENSAJES (HISTORIAL) */}
      <main className="chat-area-mensajes">
        {mensajes.length === 0 ? (
          <div className="chat-vacio-mensaje">
            <p>Aún no hay mensajes. ¡Escribe el primero y comienza la conversación!</p>
          </div>
        ) : (
          mensajes.map((msj) => (
            <MensajeCard key={msj.idMensajeChat || msj.fechaHoraEnvio + msj.idAutor} mensaje={msj} esMio={msj.idAutor === usuario.idUsuario} />
          ))
        )}
      </main>

      {/* CAJA DE TEXTO (INPUT) */}
      <footer className="chat-footer-input">
        <form className="chat-formulario" onSubmit={handleEnviar}>
          <input type="text" className="chat-caja-texto" placeholder="Escribe un mensaje aquí..." value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} />
          <button type="submit" className="chat-btn-enviar-msj" disabled={!nuevoMensaje.trim()}>Enviar</button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPantalla;
