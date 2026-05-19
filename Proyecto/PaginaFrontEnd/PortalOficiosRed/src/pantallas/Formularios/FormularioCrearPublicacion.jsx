import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioCrearPublicacion = () => {
    const navigate = useNavigate();

    // Estado para controlar los campos del formulario
    const [formData, setFormData] = useState({
        tituloPublicacion: '',
        descripcionPublicacion: '',
        nombreRegion: '',
        nombreComuna: '',
        precioServicio: '',
        imagenUrl: ''
    });

    // Simulación del ID del usuario logueado (luego lo sacas de tu AuthContext)
    const idUsuarioCreador = 1; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas antes de enviar
        if (!formData.tituloPublicacion.trim() || !formData.descripcionPublicacion.trim()) {
            alert("Por favor, rellena los campos obligatorios (Título y Descripción)");
            return;
        }

        // Estructuramos el objeto tal cual lo espera tu DTO / Modelo en Spring Boot
        const publicacionPayload = {
            idUsuario: idUsuarioCreador,
            tituloPublicacion: formData.tituloPublicacion,
            descripcionPublicacion: formData.descripcionPublicacion,
            nombreRegion: formData.nombreRegion,
            nombreComuna: formData.nombreComuna,
            precioServicio: formData.precioServicio ? parseFloat(formData.precioServicio) : null,
            imagenUrl: formData.imagenUrl || null,
            cantidadLikes: 0 // Inicia en cero
        };

        // CORRECCIÓN: Ahora apunta a la ApiGateWay (Puerto 8888) de forma centralizada
        fetch("http://localhost:8888/api/publicacionesApi", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(publicacionPayload)
        })
        .then(res => {
            if (res.ok) {
                alert("¡Publicación creada con éxito! 🎉");
                navigate("/home"); // Redirigimos al Home para que vea su tarjeta creada
            } else {
                alert("Hubo un error al crear la publicación a través de la Gateway.");
            }
        })
        .catch(err => console.error("Error al conectar con la ApiGateWay:", err));
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '25px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Ofrecer un Nuevo Servicio</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Título del Servicio *</label>
                    <input 
                        type="text" 
                        name="tituloPublicacion"
                        placeholder="Ej: Gasfíter a domicilio urgente"
                        value={formData.tituloPublicacion}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción del Servicio *</label>
                    <textarea 
                        name="descripcionPublicacion"
                        placeholder="Describe detalladamente qué incluye tu trabajo, experiencia, horarios, etc..."
                        value={formData.descripcionPublicacion}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Región</label>
                        <input 
                            type="text" 
                            name="nombreRegion"
                            placeholder="Ej: Metropolitana"
                            value={formData.nombreRegion}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Comuna</label>
                        <input 
                            type="text" 
                            name="nombreComuna"
                            placeholder="Ej: Maipú"
                            value={formData.nombreComuna}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio Base del Servicio ($)</label>
                    <input 
                        type="number" 
                        name="precioServicio"
                        placeholder="Ej: 15000 (Opcional)"
                        value={formData.precioServicio}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>URL de la Imagen de Portada</label>
                    <input 
                        type="url" 
                        name="imagenUrl"
                        placeholder="https://enlace-de-tu-foto.com/imagen.jpg (Opcional)"
                        value={formData.imagenUrl}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                        type="button" 
                        onClick={() => navigate('/home')}
                        style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Publicar Servicio 🚀
                    </button>
                </div>

            </form>
        </div>
    );
};

export default FormularioCrearPublicacion;