"use client";
import "./PokemonList.scss";

import { getPokemonList } from "@/server/pokemon/get";
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
    executeGetPokemonList({ limit: 20, offset: 20 });
  }, [executeGetPokemonList]);

  return JSON.stringify(pokemonList);
};

export default PokemonList;
