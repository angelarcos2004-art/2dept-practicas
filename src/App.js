import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [texto, setTexto] = useState("Hola esta es mi primera pagina en React");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Desarrollo Web 2o Dept
        </p>
        <pre>{texto}</pre>
        <button className="btn-multiplicar" onClick={() => setTexto((texto + "\n").repeat(10))}>
          Multiplicar
        </button>
      </header>
    </div>
  );
}

export default App;