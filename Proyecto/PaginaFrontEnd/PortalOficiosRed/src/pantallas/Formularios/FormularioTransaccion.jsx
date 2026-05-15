import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leerTodosLosMediosDePago } from '../../servicios/medioDePagoService';
import { leerTodosLosTiposDeTrabajo } from '../../servicios/tipoDeTrabajoService';
import { crearTransaccion } from '../../servicios/confirmacionTransaccionService';
// Puedes crear este CSS luego para darle estilos o usar uno genérico tuyo
import '../../style/FormularioTransaccion.css';

const FormularioTransaccion = () => {
  const { idCliente } = useParams(); // Se extrae de la URL (lo mandamos desde el chat)
  const navigate = useNavigate();
  const { usuario, token } = useContext(AuthContext);

  // Estados del formulario
  const [montoServicio, setMontoServicio] = useState('');
  const [idMedioPago, setIdMedioPago] = useState('');
  const [idTipoTrabajo, setIdTipoTrabajo] = useState('');
  const [observacionesTrato, setObservacionesTrato] = useState('');

  // Estados para las listas desplegables
  const [mediosPago, setMediosPago] = useState([]);
  const [tiposTrabajo, setTiposTrabajo] = useState([]);
  
  // Estados de control
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarListasDesplegables = async () => {
      try {
        const [medios, tipos] = await Promise.all([
          leerTodosLosMediosDePago(),
          leerTodosLosTiposDeTrabajo()
        ]);
        setMediosPago(medios || []);
        setTiposTrabajo(tipos || []);
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        alert("No se pudieron cargar las opciones de medios de pago o tipos de trabajo.");
      } finally {
        setCargando(false);
      }
    };

    cargarListasDesplegables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!montoServicio || !idMedioPago || !idTipoTrabajo) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    setEnviando(true);
    try {
      // Estructura DTO requerida por tu Backend
      const dto = {
        idUsuarioOferente: usuario.idUsuario,
        idUsuarioCliente: parseInt(idCliente),
        montoServicio: parseFloat(montoServicio),
        idMedioPago: parseInt(idMedioPago),
        idTipoTrabajo: parseInt(idTipoTrabajo),
        observacionesTrato: observacionesTrato.trim()
      };

      await crearTransaccion(dto, token);
      alert("Se envió correctamente la confirmación de transacción.");
      navigate(-1); // Regresamos al chat
    } catch (error) {
      console.error("Error al crear la transacción:", error);
      alert("Ocurrió un error al intentar enviar la transacción.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <div>Cargando formulario...</div>;

  return (
    <div className="formulario-transaccion-contenedor">
      <div className="formulario-transaccion-tarjeta">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Volver al chat</button>
        <h2>Generar Trato / Transacción</h2>
        <p>Registra el acuerdo para mayor seguridad con tu cliente.</p>
        
        <form onSubmit={handleSubmit} className="form-transaccion">
          
          <div className="form-group-transaccion">
            <label>Monto del Servicio ($):</label>
            <input type="number" min="0" step="0.01" value={montoServicio} onChange={(e) => setMontoServicio(e.target.value)} required />
          </div>

          <div className="form-group-transaccion">
            <label>Medio de Pago:</label>
            <select value={idMedioPago} onChange={(e) => setIdMedioPago(e.target.value)} required>
              <option value="">Selecciona un medio de pago</option>
              {mediosPago.map(mp => ( <option key={mp.idMedioPago || mp.id} value={mp.idMedioPago || mp.id}>{mp.nombreMedioPago || mp.nombre || `Medio de pago ${mp.idMedioPago || mp.id}`}</option> ))}
            </select>
          </div>

          <div className="form-group-transaccion">
            <label>Tipo de Trabajo:</label>
            <select value={idTipoTrabajo} onChange={(e) => setIdTipoTrabajo(e.target.value)} required>
              <option value="">Selecciona un tipo de trabajo</option>
              {tiposTrabajo.map(tt => ( <option key={tt.idTipoTrabajo || tt.id} value={tt.idTipoTrabajo || tt.id}>{tt.nombreTipoTrabajo || tt.nombre || `Tipo de trabajo ${tt.idTipoTrabajo || tt.id}`}</option> ))}
            </select>
          </div>

          <div className="form-group-transaccion">
            <label>Observaciones (opcional):</label>
            <textarea value={observacionesTrato} onChange={(e) => setObservacionesTrato(e.target.value)} rows="4" placeholder="Especifica los detalles del trabajo aquí..." />
          </div>

          <button type="submit" disabled={enviando} className="btn-enviar-transaccion"> {enviando ? 'Enviando...' : 'Confirmar Transacción'} </button>
        </form>
      </div>
    </div>
  );
};
export default FormularioTransaccion;
          
