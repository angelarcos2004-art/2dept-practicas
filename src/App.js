import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ComponenteFrm from './ComponenteFrm';

function App() {

  const textoBase = "Hola esta es mi primera pagina en React";
  const [texto, setTexto] = useState(textoBase);

  const [mostrarGaleria, setMostrarGaleria] = useState(true);

  return (
    <div className="App">
      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <p>Desarrollo Web 2o Dept</p>

        <pre>{texto}</pre>

        {/* BOTON PRACTICA ANTERIOR */}
        <button
          className="btn-multiplicar"
          onClick={() => setTexto(texto === textoBase || texto === "" ? (textoBase + "\n").repeat(10) : "")}
        >
          Mostrar componente
        </button>

        <br /><br />

        {/* BOTON GALERIA */}
        <button
          className="btn-galeria"
          onClick={() => setMostrarGaleria(!mostrarGaleria)}
        >
          {mostrarGaleria ? "Ocultar galería" : "Mostrar galería"}
        </button>

        {/* LLAMADA AL COMPONENTE */}
        {mostrarGaleria && <ComponenteFrm />}

      </header>
    </div>
  );
}

export default App;