import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import ComponenteFrm from './ComponenteFrm';
import PokemonCards from './PokemonCards';
import BackendForm from './BackendForm';
import DatabaseManager from './DatabaseManager';
import { supabase } from './supabaseClient';

function App() {

  const textoBase = "Hola esta es mi primera pagina en React";
  const [texto, setTexto] = useState(textoBase);

  const [mostrarGaleria, setMostrarGaleria] = useState(true);
  const [mostrarPokemon, setMostrarPokemon] = useState(false);
  const [mostrarBackend, setMostrarBackend] = useState(false);
  const [mostrarManager, setMostrarManager] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) setMostrarManager(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setMostrarManager(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMostrarManager = async () => {
    if (mostrarManager) {
      setMostrarManager(false);
    } else if (user) {
      setMostrarManager(true);
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href },
      });
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMostrarManager(false);
    window.open("https://accounts.google.com/logout", "_blank");
  };

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
          {texto === textoBase || texto === "" ? "Mostrar componente" : "Ocultar componente"}
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

        <br /><br />

        {/* PRACTICA 6 - BACKEND SIN AUTH */}
        <button className="btn-backend" onClick={() => setMostrarBackend(!mostrarBackend)}>
          {mostrarBackend ? "Ocultar Backend" : "Mostrar Backend"}
        </button>

        {mostrarBackend && <BackendForm />}

        <br /><br />

        {/* PRACTICA 8 - SISTEMA ESCOLAR CON AUTH */}
        <button className="btn-backend" onClick={handleMostrarManager}>
          {mostrarManager ? "Ocultar Sistema Escolar" : "Mostrar Sistema Escolar"}
        </button>

        {user && (
          <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#aaa' }}>
            Sesión: {user.email} &nbsp;
            <button
              onClick={handleCerrarSesion}
              className="btn-cerrar-sesion"
            >
              Cerrar sesión
            </button>
          </div>
        )}

        {mostrarManager && user && <DatabaseManager />}

        <br /><br />

      </header>
    </div>
  );
}

export default App;
