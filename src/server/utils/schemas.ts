import { z } from "zod";

export const GetPokemonListInputSchema = z.object({
  offset: z.number(),
  limit: z.number(),
});

export const GetPokemonByIdInputSchema = z.number();
