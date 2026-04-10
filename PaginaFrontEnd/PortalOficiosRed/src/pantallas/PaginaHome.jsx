import React, { useState, useEffect } from 'react';
import { leerTodosLosUsuarios } from '../servicios/usuariosService';

import '../style/home.css';

function PaginaHome() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await leerTodosLosUsuarios();
        if (typeof datos === 'string') {
          setError(datos);
        } else {
          setUsuarios(datos);
        }
      } catch (err) {
        setError('Ocurrió un error al obtener los usuarios.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

  if (cargando) {
    return <div className="mi-pagina-contenedor"><p>Cargando usuarios...</p></div>;
  }

  if (error) {
    return <div className="mi-pagina-contenedor"><p>Error: {error}</p></div>;
  }

  return (
    <div className="mi-pagina-contenedor">
      <h1>Lista de Usuarios</h1>
      <div className="lista-usuarios">
        {usuarios.map((usuario) => (
          <div key={usuario.idUsuario} className="card-usuario">
            <img src={usuario.foto || 'https://via.placeholder.com/150'} alt={`Foto de ${usuario.primerNombre}`} className="card-usuario-foto" />
            <h2>{usuario.primerNombre} {usuario.primerApellido}</h2>
            <p><strong>Oficio:</strong> {usuario.nombreOficio}</p>
            <p><strong>Email:</strong> {usuario.correoElec}</p>
            <p><strong>Ubicación:</strong> {usuario.nombreComuna}, {usuario.nombreRegion}</p>
            <p><strong>Valoración:</strong> {usuario.valoracion ? `${usuario.valoracion} / 5` : 'Sin valorar'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaginaHome;
