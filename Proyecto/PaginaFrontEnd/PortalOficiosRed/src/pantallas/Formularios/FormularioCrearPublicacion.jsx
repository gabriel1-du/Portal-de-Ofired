import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const FormularioCrearPublicacion = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // Estados para guardar las listas de la base de datos
    const [listaRegiones, setListaRegiones] = useState([]);
    const [listaComunas, setListaComunas] = useState([]);

    const [formData, setFormData] = useState({
        tituloPublicacion: '',
        descripcionPublicacion: '',
        idRegion: '', // Ahora guardamos el ID (número)
        idComuna: '', // Ahora guardamos el ID (número)
        precioServicio: '',
        imagenUrl: ''
    });

    // 1. Cargar las regiones al abrir el formulario
    useEffect(() => {
        fetch("http://localhost:8888/api/proxy/regionesApi", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setListaRegiones(data))
        .catch(err => console.error("Error cargando regiones:", err));
        
        // 2. Cargar comunas (puedes optimizar esto después para que filtre por región)
        fetch("http://localhost:8888/api/proxy/comunasApi", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setListaComunas(data))
        .catch(err => console.error("Error cargando comunas:", err));
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.tituloPublicacion.trim() || !formData.descripcionPublicacion.trim()) {
            alert("Por favor, rellena los campos obligatorios.");
            return;
        }

        // Armamos el paquete con los IDs convertidos a números
        const publicacionPayload = {
            idAutor: 1, // Lo dejamos en 1 por ahora para la prueba
            tituloPublicacion: formData.tituloPublicacion,
            descripcionPublicacion: formData.descripcionPublicacion,
            idRegion: formData.idRegion ? parseInt(formData.idRegion) : null,
            idComuna: formData.idComuna ? parseInt(formData.idComuna) : null,
            precioServicio: formData.precioServicio ? parseFloat(formData.precioServicio) : null,
            imagenUrl: formData.imagenUrl || null,
            cantidadLikes: 0 
        };

        // CORRECCIÓN: Le agregamos "/proxy/" a la ruta para que el Gateway no nos tire error 403
        fetch("http://localhost:8888/api/proxy/publicacionesApi", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(publicacionPayload)
        })
        .then(res => {
            if (res.ok) {
                alert("¡Publicación creada con éxito! 🎉");
                navigate("/home"); 
            } else {
                alert("Sigue habiendo un error en el servidor. Revisa la consola de Spring Boot.");
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
                        value={formData.descripcionPublicacion}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
                        required
                    />
                </div>

                {/* --- MENÚS DESPLEGABLES DE REGIÓN Y COMUNA --- */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Región</label>
                        <select 
                            name="idRegion"
                            value={formData.idRegion}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                        >
                            <option value="">Selecciona una región...</option>
                            {listaRegiones.map(region => (
                                <option key={region.idRegion} value={region.idRegion}>
                                    {region.nombreRegion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Comuna</label>
                        <select 
                            name="idComuna"
                            value={formData.idComuna}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                        >
                            <option value="">Selecciona una comuna...</option>
                            {listaComunas.map(comuna => (
                                <option key={comuna.idComuna} value={comuna.idComuna}>
                                    {comuna.nombreComuna}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio Base del Servicio ($)</label>
                    <input 
                        type="number" 
                        name="precioServicio"
                        value={formData.precioServicio}
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