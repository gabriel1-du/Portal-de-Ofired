
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PaginaHome from './pantallas/PaginaHome'; // Importa tu componente de la página
import Login from './pantallas/Login'; // Importa tu componente de Login
import FormularioCrearUsuarioCliente from './pantallas/Formularios/FormularioCrearUsuarioCliente'; // Importa el nuevo formulario
import IniciarSesion from './pantallas/Formularios/IniciarSesion'; // Importa el nuevo formulario de inicio de sesión
import FormularioCrearUsuarioOficio from './pantallas/Formularios/FormularioCrearUsuarioOficio';
import FormularioCreacionDePerfilUsuario from './pantallas/Formularios/FormularioCreacionDePerfilUsuario';
import ResultadosBusqueda from './pantallas/ResultadosBusqueda'; // Importamos la nueva página de resultados
import PerfilPantalla from './pantallas/PerfilPantalla'; // Importamos la pantalla de perfil
import ModificarPerfilUsuario from './pantallas/Formularios/ModificarPerfilUsuario';
import ConfiguracionesPantalla from './pantallas/ConfiguracionesPantalla';
import CambiarCorreoPantalla from './pantallas/FormulariosConfig/CambiarCorreoPantalla';
import CambiarTelefonoPantalla from './pantallas/FormulariosConfig/CambiarTelefonoPantalla';
import FormularioCambiarDatosUsuario from './pantallas/FormulariosConfig/FormularioCambiarDatosUsuario';
import ValoracionesPantalla from './pantallas/ValoracionPantalla'; // Importamos la pantalla de valoraciones
import FormularioCrearResenia from './pantallas/Formularios/FormularioCrearResenia'; // Importamos el nuevo form

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PaginaHome />} /> {/* Nueva ruta para la Home */
          }
          <Route path="/crear-cuenta" element={<FormularioCrearUsuarioCliente />} />
          <Route path="/crear-perfil" element={<FormularioCreacionDePerfilUsuario />} />
          <Route path="/crear-cuentOfi" element={<FormularioCrearUsuarioOficio />} /> {/* Ruta para crear cuenta de oficio */}
          <Route path="/iniciar-sesion" element={<IniciarSesion />} /> {/* Nueva ruta para iniciar sesión */}
          <Route path="/resultados" element={<ResultadosBusqueda />} /> {/* Ruta para la página de resultados */}
          <Route path="/perfil/:idDelPerfil" element={<PerfilPantalla />} /> {/* Ruta para la pantalla de perfil */}
          <Route path="/perfil/modificar" element={<ModificarPerfilUsuario />} />
          <Route path="/configuracion" element={<ConfiguracionesPantalla />} />
          <Route path="/configuracion/cambiar-correo" element={<CambiarCorreoPantalla />} />
          <Route path="/configuracion/cambiar-telefono" element={<CambiarTelefonoPantalla />} />
          <Route path="/configuracion/modificar-datos" element={<FormularioCambiarDatosUsuario />} />
          <Route path="/valoraciones/:idUsuario" element={<ValoracionesPantalla />} /> {/* Nueva ruta para ver valoraciones */}
          <Route path="/crear-resenia/:idUsuarioReseniado" element={<FormularioCrearResenia />} /> {/* Ruta para crear reseña */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
