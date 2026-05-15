import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { buscarTransaccionesPorUsuario, actualizarEstadoTransaccion } from '../servicios/confirmacionTransaccionService';
import TratoCard from '../assets/TratoCard';
import '../style/ListaTratos.css';

const ListaTratos = () => {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tratos, setTratos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarTratos = async () => {
    try {
      setCargando(true);
      const data = await buscarTransaccionesPorUsuario(usuario.idUsuario, token);
      // Ordenamos para ver los más recientes arriba
      if (data && data.length > 0) {
        data.sort((a, b) => b.idTransaccion - a.idTransaccion);
      }
      setTratos(data || []);
    } catch (error) {
      console.error("Error al cargar tratos", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario && token) cargarTratos();
  }, [usuario, token]);

  const handleActualizarEstado = async (idTrato, aceptado) => {
    try {
      await actualizarEstadoTransaccion(idTrato, { aceptado }, token);
      alert("Actualización correctamente hecha");
      cargarTratos(); // Recargamos la lista para que se actualice la vista al instante
    } catch (error) {
      alert("Error al actualizar el trato.");
    }
  };

  return (
    <div className="lista-tratos-container">
      <div className="lista-tratos-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Volver</button>
        <h2>Mis Tratos / Transacciones</h2>
      </div>

      <div className="lista-tratos-desplegable">
        {cargando ? (
          <p className="mensaje-estado">Buscando tus tratos...</p>
        ) : tratos.length === 0 ? (
          <p className="mensaje-estado">No tienes tratos registrados en los que participes.</p>
        ) : (
          <div className="tratos-grid">
            {tratos.map(trato => (
              <TratoCard key={trato.idTransaccion} trato={trato} usuarioLogueado={usuario} onActualizarEstado={handleActualizarEstado} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ListaTratos;
