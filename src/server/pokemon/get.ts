"use server";

import { z } from "zod";
import { createServerAction } from "zsa";

const GetPokemonListInputSchema = z.object({
  offset: z.number(),
  limit: z.number(),
});

type PokemonNamesAndUrlsDataType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

type PokemonDetailFullType = {
  abilities: { ability: { name: string; url: string } }[];
  base_experience: number;
  forms: { name: string; url: string }[];
  game_indices: {
    game_index: number;
    version: { name: string; url: string };
  }[];
  height: number;
  held_items: { item: { name: string; url: string } }[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: { move: { name: string; url: string } }[];
  name: string;
  order: number;
  species: { name: string; url: string };
  sprites: {
    back_default: string | null;
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  types: { slot: number; type: { name: string; url: string } }[];
  weight: number;
};

type PokemonDetailType = Omit<
  PokemonDetailFullType,
  | "game_indices"
  | "moves"
  | "sprites"
  | "stats"
  | "held_items"
  | "location_area_encounters"
>;
export const getPokemonList = createServerAction()
  .input(GetPokemonListInputSchema)
  .handler(async ({ input }) => {
    const pokemonNamesAndUrlsResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
    );
    const pokemonNamesAndUrlsData: PokemonNamesAndUrlsDataType =
      await pokemonNamesAndUrlsResponse.json();

    const pokemonListFullData = await Promise.all(
      pokemonNamesAndUrlsData.results.map(async (pokemonNameAndUrl) => {
        const pokemonDetailResponse = await fetch(pokemonNameAndUrl.url);
        const pokemonDetailData: PokemonDetailFullType =
          await pokemonDetailResponse.json();
        return pokemonDetailData;
      })
    );
    console.log({ offset: input.offset, limit: input.limit });

    // Remove unnecessary and large data from the response
    const pokemonList: PokemonDetailType[] = pokemonListFullData.map(
      ({
        game_indices,
        moves,
        sprites,
        stats,
        held_items,
        location_area_encounters,
        ...rest
      }) => rest
    );

    return pokemonList;
  });

export const getPokemonById = async (id: string) => {
  console.log({ id });
};
