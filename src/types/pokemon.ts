export type PokemonNamesAndUrlsDataType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export type PokemonDetailFullType = {
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
