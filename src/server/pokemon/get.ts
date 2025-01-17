"use server";

import type {
  PokemonDetailType,
  PokemonNamesAndUrlsDataType,
} from "@/types/pokemon";
import { apiBaseUrl } from "@/utils/constants";
import {
  GetPokemonByIdInputSchema,
  GetPokemonListInputSchema,
} from "@/server/utils/schemas";
import { createServerAction } from "zsa";
import {
  fetchPokemonDetailById,
  fetchPokemonDetailByUrl,
} from "../utils/fetch";

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
