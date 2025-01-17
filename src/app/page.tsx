import PokemonList from "./components/PokemonList";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 max-w-lg min-w-96 mx-auto bg-neutral-800">
      <h1 className="text-6xl py-5">Pokédex</h1>
      <PokemonList />
    </main>
  );
}
