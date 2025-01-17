"use client";
import "./PokemonList.scss";

import { getPokemonList, PokemonDetailType } from "@/server/pokemon/get";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerAction } from "zsa-react";

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
        limit: 18,
        offset,
      });

      if (err) {
        console.error(err);
        return;
      }

      setPokemonList((prev) => [...prev, ...pokemonListResponse]);
      setOffset((prev) => prev + 18);
    },
    [executeGetPokemonList, isPendingPokemonList]
  );

  useEffect(() => {
    fetchPokemonList(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div>{pokemon.name}</div>
            <div>{pokemon.weight}</div>
            <div>{pokemon.types.map((type) => type.type.name).join(", ")}</div>
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
