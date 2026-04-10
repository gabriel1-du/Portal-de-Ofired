
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PaginaHome from './pantallas/PaginaHome'; // Importa tu componente de la página
import Login from './pantallas/Login'; // Importa tu componente de Login
import FormularioCrearUsuarioCliente from './pantallas/Formularios/FormularioCrearUsuarioCliente'; // Importa el nuevo formulario

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/crear-cuenta" element={<FormularioCrearUsuarioCliente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
