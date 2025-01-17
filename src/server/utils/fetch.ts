import { PokemonDetailFullType } from "@/types/pokemon";
import { apiBaseUrl } from "@/utils/constants";

export const fetchPokemonDetailByUrl = async (
  url: string
): Promise<PokemonDetailFullType> => {
  const pokemonDetailResponse = await fetch(url);
  const pokemonDetailData: PokemonDetailFullType =
    await pokemonDetailResponse.json();
  return pokemonDetailData;
};

export const fetchPokemonDetailById = async (
  id: number
): Promise<PokemonDetailFullType> =>
  fetchPokemonDetailByUrl(`${apiBaseUrl}${id}`);
