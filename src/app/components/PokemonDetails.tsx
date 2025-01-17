"use client";
import { getPokemonById, PokemonDetailType } from "@/server/pokemon/get";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useServerAction } from "zsa-react";

const PokemonDetails = ({ id }: { id: number }) => {
  const [pokemonDetails, setPokemonDetails] =
    useState<PokemonDetailType | null>(null);

  const {
    isPending: isPendingGetPokemonById,
    execute: executeGetPokemonById,
    error,
  } = useServerAction(getPokemonById);

  useEffect(() => {
    const fetchData = async () => {
      const [pokemonDetails, err] = await executeGetPokemonById(id);

      if (err) {
        console.error(err);
        return;
      }
      setPokemonDetails(pokemonDetails);
    };
    fetchData();
  }, [executeGetPokemonById, id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isPendingGetPokemonById || !pokemonDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`pokemon ${pokemonDetails.types[0].type.name}`}>
      <Link href="/">Back to list</Link>
      <h1>{pokemonDetails.name}</h1>
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png`}
        alt={`Image of ${pokemonDetails.name}`}
        width={100}
        height={100}
        priority
      />
      <div>
        <h2>Abilities</h2>
        <ul>
          {pokemonDetails.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Types</h2>
        <ul>
          {pokemonDetails.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokemonDetails;
