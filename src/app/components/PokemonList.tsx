"use client";
import "./PokemonList.scss";

import { getPokemonList } from "@/server/pokemon/get";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useServerAction } from "zsa-react";

const PokemonList = () => {
  const {
    isPending: isPendingPokemonList,
    execute: executeGetPokemonList,
    data: pokemonList,
  } = useServerAction(getPokemonList /*, { initialData: {} }*/);

  console.log({ isPendingPokemonList, pokemonList });

  useEffect(() => {
    executeGetPokemonList({ limit: 100, offset: 600 });
  }, [executeGetPokemonList]);

  if (isPendingPokemonList || !pokemonList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-list">
      {pokemonList.map((pokemon) => (
        <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
          <div className={`pokemon ${pokemon.types[0].type.name}`}>
            <div>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={`Image of ${pokemon.name}`}
                width={100}
                height={100}
              />
            </div>
            <div>{pokemon.name}</div>
            <div>{pokemon.weight}</div>
            <div>{pokemon.types.map((type) => type.type.name).join(", ")}</div>
          </div>
        </Link>
      ))}
    </div>
  );

  // return JSON.stringify(pokemonList);
};

export default PokemonList;
