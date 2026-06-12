import React, { useState, useEffect } from 'react';

// === IMPORTACIÓN CORREGIDA CON TU RUTA REAL EN DISCO ===
import { crearDenuncia } from "/src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService";
import { obtenerTodosTiposDenuncia } from "/src/servicios/ApiUsuarios/DenunciarUsuario/tipoDenunciasService";
import { obtenerTodosTiposContenido } from "/src/servicios/ApiUsuarios/DenunciarUsuario/tiposContenidoDenunciados";

// === CSS CONECTADO CORRECTAMENTE AL ESTAR EN LA MISMA CARPETA ===
import "./FormularioDenuncia.css";

const FormularioDenuncia = ({ isOpen, onClose, idUsuarioDenunciado, idUsuarioDenunciante, token }) => {
    const [tipoDenuncia, setTipoDenuncia] = useState('');
    const [tipoContenido, setTipoContenido] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cargando, setCargando] = useState(false);
    
    // Estados para almacenar las listas desde la BD
    const [tiposDenunciaList, setTiposDenunciaList] = useState([]);
    const [tiposContenidoList, setTiposContenidoList] = useState([]);

    // Efecto para cargar los select dinámicamente cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            const cargarListas = async () => {
                try {
                    const denunciasData = await obtenerTodosTiposDenuncia(token);
                    const contenidoData = await obtenerTodosTiposContenido(token);
                    
                    setTiposDenunciaList(denunciasData || []);
                    setTiposContenidoList(contenidoData || []);
                } catch (error) {
                    console.error("Error al cargar los tipos de denuncia o contenido:", error);
                }
            };
            cargarListas();
        }
    }, [isOpen, token]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        
        // Objeto DTO exacto que se enviará al backend
        const datos = {
            idUsuarioDenunciante: idUsuarioDenunciante,
            idUsuarioDenunciado: idUsuarioDenunciado,
            idTipoDenuncia: parseInt(tipoDenuncia),
            descripcionDenuncia: descripcion.trim(),
            idTipoContenido: parseInt(tipoContenido)
        };

        // 🚨 LOG DE DEPURACIÓN: Revisa tu consola (F12) al darle enviar
        console.log("Datos del formulario que se van a enviar:", datos);
        console.log("ID Denunciante (X-Usuario-Id):", idUsuarioDenunciante);

        try {
            await crearDenuncia(datos, token);
            alert("✅ Reporte enviado correctamente. Un administrador lo revisará pronto.");
            setDescripcion('');
            setTipoDenuncia('');
            setTipoContenido('');
            onClose();
        } catch (error) {
            console.error("Error capturado en el componente:", error);
            alert("❌ Hubo un error al enviar el reporte. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="modal-denuncia-overlay" onClick={onClose}>
            {/* stopPropagation evita que el modal se cierre al hacer clic dentro del recuadro blanco */}
            <div className="modal-denuncia-contenido" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Reportar Usuario 🚨</h2>
                    <button type="button" className="btn-cerrar-x" onClick={onClose}>X</button>
                </div>
                
                <p className="texto-ayuda">Por favor, indícanos el motivo de tu reporte. Esta información será confidencial.</p>
                
                <form onSubmit={handleSubmit} className="formulario-denuncia">
                    <label>Motivo del reporte:</label>
                    <select value={tipoDenuncia} onChange={(e) => setTipoDenuncia(e.target.value)} required>
                        <option value="">Selecciona un motivo</option>
                        {tiposDenunciaList.map(tipo => (
                            <option key={tipo.idTipoDenuncia} value={tipo.idTipoDenuncia}>
                                {tipo.nombreTipoDenuncia}
                            </option>
                        ))}
                    </select>

                    <label>Tipo de contenido a reportar:</label>
                    <select value={tipoContenido} onChange={(e) => setTipoContenido(e.target.value)} required>
                        <option value="">Selecciona el contenido</option>
                        {tiposContenidoList.map(tipo => (
                            <option key={tipo.idTipoContenido} value={tipo.idTipoContenido}>
                                {tipo.nombreContenido}
                            </option>
                        ))}
                    </select>

                    <label>Descripción detallada:</label>
                    <textarea 
                        rows="4" 
                        placeholder="Explica brevemente qué sucedió..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />

                    <div className="botones-modal">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={cargando}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-enviar-reporte" disabled={cargando}>
                            {cargando ? 'Enviando...' : 'Enviar Reporte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioDenuncia;