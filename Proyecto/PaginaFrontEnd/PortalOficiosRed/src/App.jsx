
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PaginaHome from './pantallas/PaginaHome'; // Importa tu componente de la página
import Login from './pantallas/Login'; // Importa tu componente de Login
import FormularioCrearUsuarioCliente from './pantallas/Formularios/FormularioCrearUsuarioCliente'; // Importa el nuevo formulario
import IniciarSesion from './pantallas/Formularios/IniciarSesion'; // Importa el nuevo formulario de inicio de sesión
import FormularioCrearUsuarioOficio from './pantallas/Formularios/FormularioCrearUsuarioOficio';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PaginaHome />} /> {/* Nueva ruta para la Home */}
          <Route path="/crear-cuenta" element={<FormularioCrearUsuarioCliente />} />
          <Route path="/crear-cuentOfi" element={<FormularioCrearUsuarioOficio />} /> {/* Ruta para crear cuenta de oficio */}
          <Route path="/iniciar-sesion" element={<IniciarSesion />} /> {/* Nueva ruta para iniciar sesión */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
