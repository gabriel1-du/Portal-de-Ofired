import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leerTodosLosMediosDePago, eliminarMedioDePago } from '../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService'; 
import FormularioEditarMedioDePagoAdmin from './FormulariosAdmisnitrador/Fromulario/FormulariosMedioDePago/FormularioEditarMedioDePagoAdmin'; 
import FormularioCrearMedioDePagoAdmin from './FormulariosAdmisnitrador/Fromulario/FormulariosMedioDePago/FormularioCrearMedioDePagoAdmin'; 
import BarraLateralAdmin from '../../assets/barrasLaterales/BarraLateralAdmin';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorMediosDePago = () => {
  const navigate = useNavigate();
  const { token, usuario } = useContext(AuthContext);
  
  const [mediosPago, setMediosPago] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo] = useState('medios-pago');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [medioPagoEditandoId, setMedioPagoEditandoId] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const cargarMediosPago = useCallback(async () => {
    try {
      setCargando(true);
      const data = await leerTodosLosMediosDePago();
      
      if (typeof data === 'string') {
        setError(data);
      } else {
        setMediosPago(data || []);
      }
    } catch (err) {
      console.error("Error al cargar medios de pago:", err);
      setError("No se pudieron cargar los medios de pago. Verifica tu conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario || !usuario.habilitadorAdministrador) {
      navigate('/home');
      return;
    }
    cargarMediosPago();
  }, [usuario, navigate, cargarMediosPago]);

  const mediosFiltrados = mediosPago.filter((m) => {
    if (!terminoBusqueda) return true;
    return (m.nombreMedioPago || '').toLowerCase().includes(terminoBusqueda.toLowerCase());
  });

  const handleEliminarMedioPago = async (idMedioPago) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este medio de pago?")) {
      try {
        await eliminarMedioDePago(idMedioPago, token);
        alert("Medio de pago eliminado correctamente.");
        cargarMediosPago();
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar el registro.");
      }
    }
  };

  return (
    <div className="admin-layout-contenedor">
      <header className="admin-header-top">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Salir del panel</button>
        <h1>Panel de Administración</h1>
      </header>

      <div className="admin-body">
        <BarraLateralAdmin menuActivo={menuActivo} />

        <main className="admin-content-area">
          <div className="admin-panel-usuarios">
            <h2>Tabla de Medios de Pago</h2>
            <p>Visualización de los métodos de transacción registrados en el sistema.</p>
            
            <div className="admin-controles-tabla">
              <input 
                type="text" 
                className="admin-busqueda" 
                placeholder="🔍 Buscar por nombre..." 
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button className="btn-crear-usuario" onClick={() => setMostrarModalCrear(true)}>
                + Crear Medio de Pago
              </button>
            </div>

            {cargando ? (
              <div className="admin-loading">Cargando base de datos...</div>
            ) : error ? (
              <div className="admin-error">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Medio de Pago</th>
                      <th>Nombre del Medio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediosFiltrados.map(m => (
                      <tr key={m.idMedioPago}>
                        <td>{m.idMedioPago}</td>
                        <td>{m.nombreMedioPago}</td>
                        <td>
                          <select 
                            className="admin-action-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value === 'editar') setMedioPagoEditandoId(m.idMedioPago);
                              if (e.target.value === 'eliminar') handleEliminarMedioPago(m.idMedioPago);
                            }}
                          >
                            <option value="" disabled>Acciones...</option>
                            <option value="editar">✏️ Editar</option>
                            <option value="eliminar">🗑️ Eliminar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {mediosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center">No hay registros que coincidan con la búsqueda.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {medioPagoEditandoId && <FormularioEditarMedioDePagoAdmin medioPagoEdicionId={medioPagoEditandoId} onClose={() => setMedioPagoEditandoId(null)} onRefresh={cargarMediosPago} />}
      {mostrarModalCrear && <FormularioCrearMedioDePagoAdmin onClose={() => setMostrarModalCrear(false)} onRefresh={cargarMediosPago} />}
    </div>
  );
};

export default PantallaAdministradorMediosDePago;