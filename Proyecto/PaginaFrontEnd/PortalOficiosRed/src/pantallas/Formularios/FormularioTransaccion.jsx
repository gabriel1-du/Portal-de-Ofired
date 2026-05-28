import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leerTodosLosMediosDePago } from '../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService';
import { leerTodosLosTiposDeTrabajo } from '../../servicios/ApiUsuarios/TablasCategorias/tipoDeTrabajoService';
import { crearTransaccion } from '../../servicios/ApiUsuarios/SeccionChats/confirmacionTransaccionService';
// Puedes crear este CSS luego para darle estilos o usar uno genérico tuyo
import '../../style/formularios/FormularioTransaccion.css';

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
        observacionesTrato: observacionesTrato.trim(),
        aceptado: null // Forzamos intencionalmente que llegue como null a la base de datos
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

  if (cargando) return <div className="text-center mt-5 text-muted fst-italic">Cargando formulario...</div>;

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 w-100 formulario-transaccion-tarjeta" style={{ maxWidth: '550px' }}>
        
        <button 
          className="btn btn-link text-decoration-none text-info fw-bold p-0 position-absolute" 
          style={{ top: '25px', left: '25px' }} 
          onClick={() => navigate(-1)}
        >
          &#10094; Volver al chat
        </button>
        
        <div className="text-center mt-4 mb-4">
          <h2 className="fw-bolder text-dark mb-2 fs-3">Generar Trato / Transacción</h2>
          <p className="text-muted">Registra el acuerdo para mayor seguridad con tu cliente.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Monto del Servicio ($):</label>
            <input type="number" min="0" step="0.01" className="form-control form-control-lg shadow-sm input-transaccion" value={montoServicio} onChange={(e) => setMontoServicio(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Medio de Pago:</label>
            <select className="form-select form-control-lg shadow-sm input-transaccion" value={idMedioPago} onChange={(e) => setIdMedioPago(e.target.value)} required>
              <option value="">Selecciona un medio de pago</option>
              {mediosPago.map(mp => ( <option key={mp.idMedioPago || mp.id} value={mp.idMedioPago || mp.id}>{mp.nombreMedioPago || mp.nombre || `Medio de pago ${mp.idMedioPago || mp.id}`}</option> ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Tipo de Trabajo:</label>
            <select className="form-select form-control-lg shadow-sm input-transaccion" value={idTipoTrabajo} onChange={(e) => setIdTipoTrabajo(e.target.value)} required>
              <option value="">Selecciona un tipo de trabajo</option>
              {tiposTrabajo.map(tt => ( <option key={tt.idTipoTrabajo || tt.id} value={tt.idTipoTrabajo || tt.id}>{tt.nombreTipoTrabajo || tt.nombre || `Tipo de trabajo ${tt.idTipoTrabajo || tt.id}`}</option> ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-dark">Observaciones (opcional):</label>
            <textarea className="form-control shadow-sm input-transaccion" value={observacionesTrato} onChange={(e) => setObservacionesTrato(e.target.value)} rows="4" placeholder="Especifica los detalles del trabajo aquí..." />
          </div>

          <button type="submit" disabled={enviando} className="btn btn-transaccion w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm"> 
            {enviando ? 'Enviando...' : 'Confirmar Transacción'} 
          </button>
        </form>
      </div>
    </div>
  );
};
export default FormularioTransaccion;
          
