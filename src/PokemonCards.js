import { useEffect, useState } from "react";
import "./PokemonCards.css";

function PokemonCards() {

  const [pokemon, setPokemon] = useState(null);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
      .then(res => res.json())
      .then(data => setPokemon(data));
  }, [index]);

  if (!pokemon) return <p>Cargando...</p>;

  return (

    <div className="pokemon-container">

      <div className="pokemon-card">

        <div className="pokemon-header">
          <span>{pokemon.name.toUpperCase()}</span>
          <span>HP {pokemon.stats[0].base_stat}</span>
        </div>

        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="pokemon-img"
        />

        <div className="pokemon-info">

          <p><b>Tipo:</b> {pokemon.types.map(t => t.type.name).join(", ")}</p>
          <p><b>Altura:</b> {pokemon.height}</p>
          <p><b>Peso:</b> {pokemon.weight}</p>

        </div>

      </div>

      <div className="pokemon-nav">

        <button onClick={() => setIndex(index > 1 ? index - 1 : 1)}>
          {"<"}
        </button>

        <span>{index} / 200</span>

        <button onClick={() => setIndex(index < 200 ? index + 1 : 200)}>
          {">"}
        </button>

      </div>

    </div>
  );
}

export default PokemonCards;