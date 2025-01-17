"use server";

import { z } from "zod";
import { createServerAction } from "zsa";

const GetPokemonListInputSchema = z.object({
  offset: z.number(),
  limit: z.number(),
});

const GetPokemonByIdInputSchema = z.number();

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

export type PokemonDetailType = Omit<
  PokemonDetailFullType,
  | "game_indices"
  | "moves"
  | "sprites"
  | "stats"
  | "held_items"
  | "location_area_encounters"
>;

const apiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

const fetchPokemonDetailByUrl = async (
  url: string
): Promise<PokemonDetailFullType> => {
  const pokemonDetailResponse = await fetch(url);
  const pokemonDetailData: PokemonDetailFullType =
    await pokemonDetailResponse.json();
  return pokemonDetailData;
};

const fetchPokemonDetailById = async (
  id: number
): Promise<PokemonDetailFullType> =>
  fetchPokemonDetailByUrl(`${apiBaseUrl}${id}`);

export const getPokemonList = createServerAction()
  .input(GetPokemonListInputSchema)
  .handler(async ({ input }) => {
    // First fetch the list of Pokemon names and URLs
    const pokemonNamesAndUrlsResponse = await fetch(
      `${apiBaseUrl}?offset=${input.offset}&limit=${input.limit}`
    );
    const pokemonNamesAndUrlsData: PokemonNamesAndUrlsDataType =
      await pokemonNamesAndUrlsResponse.json();

    // Then fetch the full details of each of those Pokemon
    const pokemonListFullData = await Promise.all(
      pokemonNamesAndUrlsData.results.map(({ url }) =>
        fetchPokemonDetailByUrl(url)
      )
    );

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

export const getPokemonById = createServerAction()
  .input(GetPokemonByIdInputSchema)
  .handler(async ({ input }) => {
    const pokemonDetail = await fetchPokemonDetailById(input);
    return pokemonDetail;
  });
