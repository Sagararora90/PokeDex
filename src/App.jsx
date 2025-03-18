import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const Pokecheck = useCallback(() => {
    if (searchTerm.trim() === "") return; 
    setPokemons([]);
    setSearchTerm("")

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.trim().toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        const pokemonData = {
          name: data.name,
          image: data.sprites.other["official-artwork"].front_default,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities.map((ability) => ability.ability.name),
        };
        setPokemons([pokemonData]); 
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }, [searchTerm]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/");
        const data = await res.json();
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailsRes = await fetch(pokemon.url);
            const detailsData = await detailsRes.json();
            return {
              name: pokemon.name,
              image: detailsData.sprites.other["official-artwork"].front_default,
              height: detailsData.height,
              weight: detailsData.weight,
              abilities: detailsData.abilities.map((ability) => ability.ability.name),
            };
          })
        );
        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div>
      <div className="flex py-6 items-center bg-red-500 justify-between px-6 flex-wrap">
        <img src="/images.png" alt="LOGO" width="100" />
        <p className="text-6xl font-semibold text-white">PokiCheck</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-60 py-2 px-4 bg-white rounded-lg border border-gray-300 outline-none"
            placeholder="Search..."
          />
          <button onClick={Pokecheck} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Search
          </button>
        </div>
      </div>
      <div className="pokemon-container">
        {pokemons.map((pokemon, index) => (
          <div key={index} className="pokemon-card">
            <img src={pokemon.image} alt={pokemon.name} className="w-full" />
            <h1 className="text-center font-bold text-xl mt-2 capitalize">Name: {pokemon.name}</h1>
            <h2 className="text-center font-bold text-xl mt-2 capitalize">Height: {((pokemon.height * 0.0328084*10)).toFixed(2)} Feet</h2>
            <h2 className="text-center font-bold text-xl mt-2 capitalize">Weight: {pokemon.weight / 10} kg</h2>
            <div className="text-center mt-2">
              <h3 className="font-bold text-2xl">Abilities:</h3>
              {pokemon.abilities.map((ability, idx) => (
                <p key={idx} className="capitalize text-xl">{ability}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
