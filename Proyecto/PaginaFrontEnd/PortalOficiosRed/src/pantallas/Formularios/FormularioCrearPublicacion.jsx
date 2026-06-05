import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllRegions } from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import { getAllComunas } from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import { createPublicacion } from '../../servicios/ApiPublicaciones/publicacionesService';
import { agregarFotoPublicacion } from '../../servicios/ApiPublicaciones/fotosPubli';

const FormularioCrearPublicacion = () => {
    const navigate = useNavigate();

    // Traemos 'usuario' y 'token' desde tu contexto
    const { usuario, token } = useContext(AuthContext); 

    // Estados para guardar las listas de la base de datos
    const [listaRegiones, setListaRegiones] = useState([]);
    const [listaComunas, setListaComunas] = useState([]);
    const [archivosFoto, setArchivosFoto] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [subiendo, setSubiendo] = useState(false);

    const [formData, setFormData] = useState({
        tituloPublicacion: '',
        descripcionPublicacion: '',
        idRegion: '', 
        idComuna: '', 
        precioServicio: ''
    });

    // 1. Cargar las regiones al abrir el formulario
    useEffect(() => {
        const cargarListas = async () => {
            try {
                const regiones = await getAllRegions();
                setListaRegiones(regiones || []);
            } catch (error) {
                console.error("Error cargando regiones:", error);
            }

            try {
                const comunas = await getAllComunas();
                setListaComunas(comunas || []);
            } catch (error) {
                console.error("Error cargando comunas:", error);
            }
        };
        cargarListas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (archivosFoto.length + files.length > 2) {
            alert('Solo puedes subir un máximo de 2 fotos.');
            return;
        }
        const nuevosArchivos = [...archivosFoto, ...files];
        setArchivosFoto(nuevosArchivos);
        setPreviews(nuevosArchivos.map(file => URL.createObjectURL(file)));
    };

    const eliminarFoto = (index) => {
        setArchivosFoto(archivosFoto.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.tituloPublicacion.trim() || !formData.descripcionPublicacion.trim()) {
            alert("Por favor, rellena los campos obligatorios.");
            return;
        }

        setSubiendo(true);

        // Armamos el paquete con los IDs convertidos a números
        const publicacionPayload = {
            idAutor: usuario?.idUsuario || 1, 
            tituloPublicacion: formData.tituloPublicacion,
            idRegion: formData.idRegion ? parseInt(formData.idRegion) : null,
            idComuna: formData.idComuna ? parseInt(formData.idComuna) : null,
            ubicacionPublicacion: null, // Lo enviamos como null ya que está en tu DTO
            descripcionPublicacion: formData.descripcionPublicacion,
            precioServicio: formData.precioServicio ? parseFloat(formData.precioServicio) : null,
            imagenUrl: null // Lo enviamos nulo porque ahora usaremos la tabla fotos
        };

        try {
            // 1. Crear la publicación
            const nuevaPub = await createPublicacion(publicacionPayload, token);
            
            // 2. Subir las fotos asociadas al ID generado (iterando el arreglo)
            if (nuevaPub && nuevaPub.idPublicacion && archivosFoto.length > 0) {
                for (const foto of archivosFoto) {
                    await agregarFotoPublicacion(nuevaPub.idPublicacion, foto, token);
                }
            }

            alert("¡Publicación creada con éxito! 🎉");
            navigate("/home"); 
        } catch (err) {
            console.error("Error al crear la publicación:", err);
            alert("Hubo un error en el servidor al intentar guardar la publicación.");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '25px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Ofrecer un Nuevo Servicio</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div> {/* Título del Servicio */ }
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

                <div> {/* Descripción del Servicio */ }
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
                        {/* Aquí cargamos las regiones desde la base de datos */}
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
                        {/* Aquí cargamos las comunas desde la base de datos */}
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

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Imágenes del Servicio (Máx 2 fotos)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={archivosFoto.length >= 2}
                    />
                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Sube hasta 2 fotos desde tu dispositivo para mostrar tu trabajo.</small>
                    
                    {/* Previsualización de imágenes */}
                    {previews.length > 0 && (
                        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                            {previews.map((preview, index) => (
                                <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                    <img 
                                        src={preview} 
                                        alt={`Preview ${index}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => eliminarFoto(index)}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '1', padding: '0' }}
                                        title="Eliminar foto"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                        type="button" 
                        onClick={() => navigate('/home')}
                        style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        disabled={subiendo}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        style={{ flex: 1, padding: '12px', backgroundColor: subiendo ? '#1e7e34' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: subiendo ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        disabled={subiendo}
                    >
                        {subiendo ? 'Publicando...' : 'Publicar Servicio 🚀'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default FormularioCrearPublicacion;