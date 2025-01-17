"use client";
import { uCaseFirst } from "@/utils/strings";
import "./PokemonList.scss";

import { getPokemonList } from "@/server/pokemon/get";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerAction } from "zsa-react";
import { PokemonDetailType } from "@/types/pokemon";

const pokemonPerFetch = 18;

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState<PokemonDetailType[]>([]);
  const [offset, setOffset] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { isPending: isPendingPokemonList, execute: executeGetPokemonList } =
    useServerAction(getPokemonList, { persistDataWhilePending: true });

  const fetchPokemonList = useCallback(
    async (offset: number) => {
      if (isPendingPokemonList) return;

      const [pokemonListResponse, err] = await executeGetPokemonList({
        limit: pokemonPerFetch,
        offset,
      });

      if (err) {
        console.error(err);
        return;
      }

      setPokemonList((prev) => [...prev, ...pokemonListResponse]);
      setOffset((prev) => prev + pokemonPerFetch);
    },
    [executeGetPokemonList, isPendingPokemonList]
  );

  useEffect(() => {
    fetchPokemonList(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPendingPokemonList) {
          fetchPokemonList(offset);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
    );

    const listener = document.querySelector("#listener");
    if (listener) observer.observe(listener);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [fetchPokemonList, isPendingPokemonList, offset]);

  if (!pokemonList) {
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
            <div className="title">{uCaseFirst(pokemon.name)}</div>
            <div>No° {pokemon.id}</div>
            <div className="types">
              {pokemon.types
                .map(({ type: { name } }) => uCaseFirst(name))
                .join(" / ")}
            </div>
          </div>
        </Link>
      ))}
      <div id="listener" className="listener">
        {isPendingPokemonList && "Loading more pokemon..."}
      </div>
    </div>
  );
};

export default PokemonList;
