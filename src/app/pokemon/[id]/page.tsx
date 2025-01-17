import PokemonDetails from "@/app/components/PokemonDetails";

import { use } from "react";

const PokemonPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const usedParams = use(params);
  const id = +usedParams.id;
  return <PokemonDetails id={id} />;
};

export default PokemonPage;
