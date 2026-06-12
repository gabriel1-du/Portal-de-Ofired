import React, { useState } from 'react';

// === IMPORTACIÓN CORREGIDA CON TU RUTA REAL EN DISCO ===
import { crearDenuncia } from "/src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService";

// === CSS CONECTADO CORRECTAMENTE AL ESTAR EN LA MISMA CARPETA ===
import "./FormularioDenuncia.css";

const FormularioDenuncia = ({ isOpen, onClose, idUsuarioDenunciado, idUsuarioDenunciante, token }) => {
    const [tipoDenuncia, setTipoDenuncia] = useState(1);
    const [descripcion, setDescripcion] = useState('');
    const [cargando, setCargando] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        
        // Objeto que se enviará al backend
        const datos = {
            idUsuarioDenunciado: idUsuarioDenunciado,
            idTipoDenuncia: tipoDenuncia,
            descripcionDenuncia: descripcion
        };

        // 🚨 LOG DE DEPURACIÓN: Revisa tu consola (F12) al darle enviar
        console.log("Datos del formulario que se van a enviar:", datos);
        console.log("ID Denunciante (X-Usuario-Id):", idUsuarioDenunciante);

        try {
            await crearDenuncia(idUsuarioDenunciante, datos, token);
            alert("✅ Reporte enviado correctamente. Un administrador lo revisará pronto.");
            setDescripcion('');
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
                    <select value={tipoDenuncia} onChange={(e) => setTipoDenuncia(parseInt(e.target.value))} required>
                        <option value={1}>Fraude o Estafa</option>
                        <option value={2}>Comportamiento Inadecuado / Acoso</option>
                        <option value={3}>Perfil Falso / Spam</option>
                        <option value={4}>Servicio mal realizado</option>
                        <option value={5}>Otro</option>
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