import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { leerMensajesPorChat } from '../servicios/mensajesChatService';
import { leerTodosLosParticipantesFront } from '../servicios/participantesChatService';
import { webSocketService } from '../servicios/webSocketService';
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

  const mensajesEndRef = useRef(null); // Ref para el auto-scroll hacia el final

  useEffect(() => {
    if (!usuario || !token) {
      navigate('/iniciar-sesion');
      return;
    }
    cargarDatosChat();
  }, [idChat, usuario]);

  // Hacemos scroll hacia abajo cada vez que el arreglo de mensajes se actualiza
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

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
      
      // Ordenamos los mensajes del más viejo al más nuevo por fechaHoraEnvio
      if (msjs && msjs.length > 0) {
        msjs.sort((a, b) => new Date(a.fechaHoraEnvio) - new Date(b.fechaHoraEnvio));
      }
      
      setMensajes(prevMensajes => {
        // Comparamos la cantidad actual con la nueva para saber si llegó algo nuevo.
        // Esto evita "parpadeos" y que la pantalla baje forzosamente cada 3 segundos si no hay novedades.
        const nuevaCantidad = msjs ? msjs.length : 0;
        if (prevMensajes.length !== nuevaCantidad) {
          return msjs || [];
        }
        return prevMensajes;
      });
    } catch (error) {
      console.error("Error al recargar mensajes:", error);
    }
  };

  // EFECTO DE WEBSOCKETS: Conecta y escucha mensajes en tiempo real
  useEffect(() => {
    if (!idChat || !token) return;
    
    webSocketService.connect(token, () => {
      webSocketService.subscribeToChat(idChat, (nuevoMensaje) => {
        setMensajes((prevMensajes) => {
          // Evita duplicar el mensaje si por latencia se colara dos veces
          if (prevMensajes.some(m => m.idMensajeChat === nuevoMensaje.idMensajeChat)) return prevMensajes;
          return [...prevMensajes, nuevoMensaje];
        });
      });
    });

    // Nos desconectamos educadamente al salir de esta pantalla
    return () => webSocketService.disconnect();
  }, [idChat, token]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    
    try {
      // DTO con la estructura exacta: mensajeTexto, idChat, idAutor
      const dtoMensaje = {
        mensajeTexto: nuevoMensaje.trim(),
        idChat: parseInt(idChat),
        idAutor: usuario.idUsuario
      };
      
      // En lugar de hacer HTTP POST, mandamos el mensaje por el tubo de WebSocket
      webSocketService.sendMessage(dtoMensaje);
      setNuevoMensaje('');
      
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
            <MensajeCard 
              key={msj.idMensajeChat || msj.fechaHoraEnvio + msj.idAutor} 
              mensaje={msj} 
              esMio={msj.idAutor === usuario.idUsuario} 
            />
          ))
        )}
        {/* Elemento invisible al final de la lista para hacer scroll hacia él */}
        <div ref={mensajesEndRef} />
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
