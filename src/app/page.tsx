import PokemonList from "./components/PokemonList";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <PokemonList />
    </div>
  );
}
