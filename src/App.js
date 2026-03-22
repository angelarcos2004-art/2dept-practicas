import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const textoBase = "Hola esta es mi primera pagina en React";
  const [texto, setTexto] = useState(textoBase);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Desarrollo Web 2o Dept
        </p>
        <pre>{texto}</pre>
        <button className="btn-multiplicar" onClick={() => setTexto(texto === textoBase || texto === "" ? (textoBase + "\n").repeat(10) : "")}>
          Multiplicar / Ocultar 2do click
        </button>
      </header>
    </div>
  );
}

export default App;