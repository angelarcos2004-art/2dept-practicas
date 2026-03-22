import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import ComponenteFrm from './ComponenteFrm';
import PokemonCards from './PokemonCards';

function App() {

  const textoBase = "Hola esta es mi primera pagina en React";
  const [texto, setTexto] = useState(textoBase);

  const [mostrarGaleria, setMostrarGaleria] = useState(true);
  const [mostrarPokemon, setMostrarPokemon] = useState(false);

  return (
    <div className="App">
      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <p>Desarrollo Web 2o Dept</p>

        <pre>{texto}</pre>

        {/* PRACTICA 2 */}
        <button
          className="btn-multiplicar"
          onClick={() => setTexto(texto === textoBase || texto === "" ? (textoBase + "\n").repeat(10) : "")}
        >
          Mostrar componente
        </button>

        <br /><br />

        {/* GALERIA */}
        <button
          className="btn-galeria"
          onClick={() => setMostrarGaleria(!mostrarGaleria)}
        >
          {mostrarGaleria ? "Ocultar galería" : "Mostrar galería"}
        </button>

        {mostrarGaleria && <ComponenteFrm />}

        <br /><br />

        {/* POKEMON */}
        <button
          className="btn-pokemon"
          onClick={() => setMostrarPokemon(!mostrarPokemon)}
        >
          {mostrarPokemon ? "Ocultar Pokémon" : "Mostrar Pokémon"}
        </button>

        {mostrarPokemon && <PokemonCards />}

      </header>
    </div>
  );
}

export default App;