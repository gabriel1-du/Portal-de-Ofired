import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createResenia } from '../../servicios/reseniasService';
import '../../style/formularioCrearResenia.css';

function FormularioCrearResenia() {
  const navigate = useNavigate();
  // Recuperamos el ID del usuario que será reseñado (viene de la URL)
  const { idUsuarioReseniado } = useParams(); 
  // Obtenemos al usuario que está logueado y su token
  const { usuario, token } = useContext(AuthContext); 

  const [calificacion, setCalificacion] = useState('');
  const [textoResenia, setTextoResenia] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!calificacion || !textoResenia.trim()) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    if (!usuario || !token) {
      setMensaje('Debes iniciar sesión para crear una reseña.');
      return;
    }

    setCargando(true);

    try {
      // Armamos el JSON exactamente como lo exige tu backend en Java
      const reseniaData = {
        idAutor: usuario.idUsuario,
        idUsuarioReseniado: parseInt(idUsuarioReseniado),
        calificacion: parseFloat(calificacion),
        textoResenia: textoResenia.trim()
      };

      await createResenia(reseniaData, token);
      alert('¡Reseña creada exitosamente!');
      navigate(-1); // Nos devuelve a la pantalla anterior (Las valoraciones del usuario)
    } catch (error) {
      console.error("Error al crear reseña:", error);
      setMensaje('Ocurrió un error al enviar la reseña. Inténtalo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="formulario-resenia-contenedor">
      <div className="formulario-resenia-tarjeta">
        <h2>Crear Reseña</h2>
        <p>Comparte tu experiencia con este usuario.</p>
        
        {mensaje && <p className="mensaje-estado">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="form-resenia">
          <div className="form-group-resenia">
            <label htmlFor="calificacion">Calificación (1 al 5):</label>
            <select id="calificacion" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} required>
              <option value="">Selecciona una calificación</option>
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Muy bueno</option>
              <option value="3">3 - Bueno</option>
              <option value="2">2 - Regular</option>
              <option value="1">1 - Malo</option>
            </select>
          </div>

          <div className="form-group-resenia">
            <label htmlFor="textoResenia">Comentario:</label>
            <textarea id="textoResenia" value={textoResenia} onChange={(e) => setTextoResenia(e.target.value)} placeholder="Escribe aquí tu experiencia..." rows="5" required></textarea>
          </div>

          <div className="botones-resenia">
            <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn-enviar" disabled={cargando}>{cargando ? 'Enviando...' : 'Enviar Reseña'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioCrearResenia;