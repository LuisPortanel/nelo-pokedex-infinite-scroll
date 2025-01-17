"use client";

import { uCaseFirst } from "@/utils/strings";
import "./PokemonDetails.scss";

import { getPokemonById } from "@/server/pokemon/get";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useServerAction } from "zsa-react";
import type { PokemonDetailType } from "@/types/pokemon";

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
    <div className={`pokemon pokemon-details `}>
      <Link href="/" className="back" title="Go back">{`‹`}</Link>
      <div className={`pokemon-image ${pokemonDetails.types[0].type.name}`}>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png`}
          alt={`Image of ${pokemonDetails.name}`}
          width={250}
          height={250}
          priority
        />
      </div>
      <h1 className="title">{uCaseFirst(pokemonDetails.name)}</h1>

      <p className="number">N° {pokemonDetails.id}</p>

      <div className="chip-container">
        {pokemonDetails.types.map(({ type: { name } }) => (
          <div className={`chip ${name}`} key={name}>
            {uCaseFirst(name)}
          </div>
        ))}
      </div>

      <div className="stats-container">
        <div className="stats">
          <h2>Height</h2>
          <p>{pokemonDetails.height}m</p>
        </div>

        <div className="stats">
          <h2>Weight</h2>
          <p>{pokemonDetails.weight}kg</p>
        </div>

        <div className="stats">
          <h2>Order</h2>
          <p>{pokemonDetails.order}</p>
        </div>

        <div className="stats">
          <h2>Base Experience</h2>
          <p>{pokemonDetails.base_experience}</p>
        </div>

        <div className="stats">
          <h2>Abilities</h2>
          <ul>
            {pokemonDetails.abilities.map((ability) => (
              <li key={ability.ability.name}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
