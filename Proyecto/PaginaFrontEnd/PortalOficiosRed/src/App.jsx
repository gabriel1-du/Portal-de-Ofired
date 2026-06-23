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
import ChatPantalla from './pantallas/PantallasMensajes/ChatPantalla'; // Importamos la pantalla de chat
import MisMensajesPantalla from './pantallas/PantallasMensajes/MisMensajesPantalla'; // Importamos la lista de chats
import FormularioTransaccion from './pantallas/Formularios/FormularioTransaccion'; // Importamos el formulario de transacciones
import ListaTratos from './pantallas/PantallasMensajes/ListaTratos'; // Importamos la lista de tratos
//Seccion de administradores
import PantallaAdministradorUsuarios from './pantallas/SeccionAdministrador/PantallaAdministradorUsuarios'; // Importamos pantalla de administrador
import PantallaAdministradorRegiones from './pantallas/SeccionAdministrador/PantallaAdministradorRegiones'; // Importamos pantalla de administrador regiones
import PantallaAdministradorComunas from './pantallas/SeccionAdministrador/PantallaAdministradorComunas'; // Importamos pantalla de administrador comunas
import PantallaAdministradorOficios from './pantallas/SeccionAdministrador/PantallaAdministradorOficios'; // Importamos pantalla de administrador oficios
import PantallaAdministradorSexos from './pantallas/SeccionAdministrador/PantallaAdministradorSexos';
import PantallaAdministradorMediosDePago from './pantallas/SeccionAdministrador/PantallaAdministradorMediosDePago';
// IMPORTAMOS LA PANTALLA DE COMENTARIOS
import DetallePublicacionPantalla from './pantallas/DetallePublicacionPantalla'; 

// IMPLEMENTACIÓN: IMPORTAMOS EL NUEVO FORMULARIO DE CREAR PUBLICACIÓN
import FormularioCrearPublicacion from './pantallas/Formularios/FormularioCrearPublicacion';
import PantallaAdministradorPublicaciones from './pantallas/SeccionAdministrador/PantallaAdministradorPublicaciones';
import PantallaAdministradorPerfiles from './pantallas/SeccionAdministrador/PantallaAdministradorPerfiles';
import PantallaAdministradorResenias from './pantallas/SeccionAdministrador/PantallaAdministradorResenias';
import PantallaDetalleReseniaAdmin from './pantallas/SeccionAdministrador/PantallaDetalleReseniaAdmin';
import PantallaAdministradorRespuestasResenias from './pantallas/SeccionAdministrador/PantallaAdministradorRespuestasResenias';
import PantallaDetalleRespuestaReseniaAdmin from './pantallas/SeccionAdministrador/PantallaDetalleRespuestaReseniaAdmin';
import PantallaAdministradorDenuncias from './pantallas/SeccionAdministrador/PantallaAdministradorDenuncias';
import PantallaDetalleDenunciaAdmin from './pantallas/SeccionAdministrador/PantallaDetalleDenunciaAdmin';

//RECUPERACION DE CONTRASENAS
import SolicitarRecuperacion from './pantallas/Formularios/FomulariosHome/SolicitarRecuperacion';
import RecuperarPassword from './pantallas/Formularios/FomulariosHome/RecuperarPassword'; 

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
          <Route path="/solicitar-recuperacion" element={<SolicitarRecuperacion />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
        
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

          {/* RUTA PARA EL PANEL DE ADMINISTRACIÓN */}
          <Route path="/admin/usuarios" element={<PantallaAdministradorUsuarios />} />
    
          <Route path="/admin/perfiles" element={<PantallaAdministradorPerfiles />} />
          <Route path="/admin/regiones" element={<PantallaAdministradorRegiones />} />
          <Route path="/admin/comunas" element={<PantallaAdministradorComunas />} />
          <Route path="/admin/oficios" element={<PantallaAdministradorOficios />} />
          <Route path="/admin/sexos" element={<PantallaAdministradorSexos />} />
          <Route path="/admin/medios-pago" element={<PantallaAdministradorMediosDePago />} />

          {/* RUTA DINÁMICA PARA EL DETALLE Y COMENTARIOS DE LA PUBLICACIÓN */}
          <Route path="/publicacion/:idPublicacion" element={<DetallePublicacionPantalla />} />

          {/* IMPLEMENTACIÓN: NUEVA RUTA PARA EL FORMULARIO DE CREACIÓN */}
          <Route path="/crear-publicacion" element={<FormularioCrearPublicacion />} />
          <Route path="/admin/publicaciones" element={<PantallaAdministradorPublicaciones />} />
          <Route path="/admin/resenias" element={<PantallaAdministradorResenias />} />
          <Route path="/admin/resenias/:idResenia" element={<PantallaDetalleReseniaAdmin />} />
          <Route path="/admin/respuestas-resenias" element={<PantallaAdministradorRespuestasResenias />} />
          <Route path="/admin/respuestas-resenias/:idRespuestaResenia" element={<PantallaDetalleRespuestaReseniaAdmin />} />
          <Route path="/admin/denuncias" element={<PantallaAdministradorDenuncias />} />
          <Route path="/admin/denuncias/:idDenuncia" element={<PantallaDetalleDenunciaAdmin />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;