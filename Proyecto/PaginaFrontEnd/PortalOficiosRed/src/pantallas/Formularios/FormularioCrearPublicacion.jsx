import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const FormularioCrearPublicacion = () => {
    const navigate = useNavigate();

    // Traemos 'usuario' y 'token' desde tu contexto
    const { usuario, token } = useContext(AuthContext); 

    // Estados para guardar las listas de la base de datos
    const [listaRegiones, setListaRegiones] = useState([]);
    const [listaComunas, setListaComunas] = useState([]);

    const [formData, setFormData] = useState({
        tituloPublicacion: '',
        descripcionPublicacion: '',
        idRegion: '', 
        idComuna: '', 
        precioServicio: '',
        imagenUrl: '' // 👈 Aquí guardaremos el link de la foto
    });

    // 1. Cargar las regiones al abrir el formulario
    useEffect(() => {
        fetch("http://localhost:8888/api/proxy/regionesApi", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setListaRegiones(data))
        .catch(err => console.error("Error cargando regiones:", err));
        
        // 2. Cargar comunas
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
            idAutor: usuario?.idUsuario || 1, 
            tituloPublicacion: formData.tituloPublicacion,
            descripcionPublicacion: formData.descripcionPublicacion,
            idRegion: formData.idRegion ? parseInt(formData.idRegion) : null,
            idComuna: formData.idComuna ? parseInt(formData.idComuna) : null,
            precioServicio: formData.precioServicio ? parseFloat(formData.precioServicio) : null,
            imagenUrl: formData.imagenUrl || null, // 👈 Enviamos el link al backend
            cantidadLikes: 0 
        };

        // Enviar publicación al Gateway
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
                alert("Hubo un error en el servidor al intentar guardar la publicación.");
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

                {/* 👇 AQUÍ AGREGAMOS EL CAMPO PARA LA IMAGEN */}
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Link de la Imagen (Opcional)</label>
                    <input 
                        type="url" 
                        name="imagenUrl"
                        placeholder="https://ejemplo.com/foto.jpg"
                        value={formData.imagenUrl}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Pega aquí la URL de la imagen que quieres mostrar en el muro.</small>
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