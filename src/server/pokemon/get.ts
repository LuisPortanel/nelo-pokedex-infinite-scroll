"use server";

import { z } from "zod";
import { createServerAction } from "zsa";

const GetPokemonListInputSchema = z.object({
  offset: z.number(),
  limit: z.number(),
});

type PokemonListType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};
export const getPokemonList = createServerAction()
  .input(GetPokemonListInputSchema)
  .handler(async ({ input }) => {
    const pokemonListResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
    );
    const pokemonListData: PokemonListType = await pokemonListResponse.json();
    console.log({ offset: input.offset, limit: input.limit });
    return pokemonListData;
  });

export const getPokemonById = async (id: string) => {
  console.log({ id });
};
