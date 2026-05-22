import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PaginaHome from './pantallas/PaginaPrincipal'; // Importa tu componente de la página
import Home from './pantallas/home'; // Importa el componente renombrado (antes Login)
import FormularioCrearUsuarioCliente from './pantallas/Formularios/FomulariosHome/FormularioCrearUsuarioCliente'; // Importa el nuevo formulario
import IniciarSesion from './pantallas/Formularios/FomulariosHome/IniciarSesion'; // Importa el nuevo formulario de inicio de sesión
import FormularioCrearUsuarioOficio from './pantallas/Formularios/FomulariosHome/FormularioCrearUsuarioOficio';
import FormularioCreacionDePerfilUsuario from './pantallas/FormularioCreacionDePerfilUsuario';
import ResultadosBusqueda from './pantallas/ResultadosBusqueda'; // Importamos la nueva página de resultados
import PerfilPantalla from './pantallas/PerfilPantalla'; // Importamos la pantalla de perfil
import ModificarPerfilUsuario from './pantallas/Formularios/ModificarPerfilUsuario';
import ConfiguracionesPantalla from './pantallas/ConfiguracionesPantalla';
import CambiarCorreoPantalla from './pantallas/FormulariosConfig/CambiarCorreoPantalla';
import CambiarTelefonoPantalla from './pantallas/FormulariosConfig/CambiarTelefonoPantalla';
import FormularioCambiarDatosUsuario from './pantallas/FormulariosConfig/FormularioCambiarDatosUsuario';
import ValoracionesPantalla from './pantallas/ValoracionPantalla'; // Importamos la pantalla de valoraciones
import FormularioCrearResenia from './pantallas/Formularios/FormularioCrearResenia'; // Importamos el nuevo form
import ChatPantalla from './pantallas/ChatPantalla'; // Importamos la pantalla de chat
import MisMensajesPantalla from './pantallas/MisMensajesPantalla'; // Importamos la lista de chats
import FormularioTransaccion from './pantallas/Formularios/FormularioTransaccion'; // Importamos el formulario de transacciones
import ListaTratos from './pantallas/ListaTratos'; // Importamos la lista de tratos
import PantallaAdministradorUsuarios from './pantallas/SeccionAdministrador/PantallaAdministradorUsuarios'; // Importamos pantalla de administrador

// IMPORTAMOS LA PANTALLA DE COMENTARIOS
import DetallePublicacionPantalla from './pantallas/DetallePublicacionPantalla'; 

// IMPLEMENTACIÓN: IMPORTAMOS EL NUEVO FORMULARIO DE CREAR PUBLICACIÓN
import FormularioCrearPublicacion from './pantallas/Formularios/FormularioCrearPublicacion';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<PaginaHome />} />
          <Route path="/crear-cuenta" element={<FormularioCrearUsuarioCliente />} />
          <Route path="/crear-perfil" element={<FormularioCreacionDePerfilUsuario />} />
          <Route path="/crear-cuentOfi" element={<FormularioCrearUsuarioOficio />} />
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/resultados" element={<ResultadosBusqueda />} />
          <Route path="/perfil/:idDelPerfil" element={<PerfilPantalla />} />
          <Route path="/perfil/modificar" element={<ModificarPerfilUsuario />} />
          <Route path="/configuracion" element={<ConfiguracionesPantalla />} />
          <Route path="/configuracion/cambiar-correo" element={<CambiarCorreoPantalla />} />
          <Route path="/configuracion/cambiar-telefono" element={<CambiarTelefonoPantalla />} />
          <Route path="/configuracion/modificar-datos" element={<FormularioCambiarDatosUsuario />} />
          <Route path="/valoraciones/:idUsuario" element={<ValoracionesPantalla />} />
          <Route path="/crear-resenia/:idUsuarioReseniado" element={<FormularioCrearResenia />} />
          <Route path="/chat/:idChat" element={<ChatPantalla />} />
          <Route path="/mis-mensajes" element={<MisMensajesPantalla />} />
          <Route path="/crear-transaccion/:idCliente" element={<FormularioTransaccion />} />
          <Route path="/mis-tratos" element={<ListaTratos />} />
          <Route path="/admin/usuarios" element={<PantallaAdministradorUsuarios />} />

          {/* RUTA DINÁMICA PARA EL DETALLE Y COMENTARIOS DE LA PUBLICACIÓN */}
          <Route path="/publicacion/:idPublicacion" element={<DetallePublicacionPantalla />} />

          {/* IMPLEMENTACIÓN: NUEVA RUTA PARA EL FORMULARIO DE CREACIÓN */}
          <Route path="/crear-publicacion" element={<FormularioCrearPublicacion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;