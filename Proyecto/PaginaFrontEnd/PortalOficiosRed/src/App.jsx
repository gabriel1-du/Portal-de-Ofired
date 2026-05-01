
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
        </Routes>
      </div>
    </Router>
  );
}

export default App
