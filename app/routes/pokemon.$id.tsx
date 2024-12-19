import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { useState } from "react";
import { obtenerDetallePokemon } from "~/utils/pokemon";
import { BackwardIcon } from "@heroicons/react/24/solid";

export const loader: LoaderFunction = async ({ params }) => {
  const pokemon = await obtenerDetallePokemon(params.id || "");
  if (!pokemon) {
    throw new Response("Pokémon no encontrado", { status: 404 });
  }
  return json(pokemon);
};

export default function DetallePokemon() {
  const pokemon = useLoaderData<typeof loader>();
  const { id } = useParams();
  const [reproduciendo, setReproduciendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reproducirSonido = async () => {
    try {
      setError(null);
      setReproduciendo(true);
      
      const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`);
      console.log(audio.src);
      audio.onended = () => setReproduciendo(false);
      audio.onerror = () => {
        setError("No se pudo cargar el sonido del Pokémon.");
        setReproduciendo(false);
      };

      await audio.play();

    } catch (err) {
      console.error("Error al reproducir el sonido:", err);
      setError("Hubo un error al reproducir el sonido.");
      setReproduciendo(false);
    }
  };

  return (
    <div className="bg-gray-400 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="flex items-center text-blue-700 hover:text-black transition-colors duration-200"
        >
          <BackwardIcon className="w-5 h-5 mr-2 hover:text-gray-900" />
          <span>Volver al listado</span>
        </Link>
        <h2 className="text-3xl font-bold capitalize">{pokemon.nombre}</h2>
      </div>
      <img 
        src={pokemon.imagen} 
        alt={pokemon.nombre} 
        className="mx-auto mb-2 h-40 hover:scale-110 transition-transform" 
      />
      <div className="space-y-2">
        <p><span className="font-semibold">Tipo:</span> {pokemon.tipo}</p>
        <p><span className="font-semibold">Peso:</span> {pokemon.peso} kg</p>
        <p><span className="font-semibold">Altura:</span> {pokemon.altura / 10} m</p>
      </div>
      <button 
        onClick={reproducirSonido}
        disabled={reproduciendo}
        className={`mt-4 ${
          reproduciendo 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-yellow-500 hover:bg-yellow-600'
        } text-white font-bold py-2 px-4 rounded transition-colors`}
      >
        {reproduciendo ? 'Reproduciendo...' : 'Reproducir sonido'}
      </button>
      {error && (
        <p className="mt-2 text-red-500 bg-red-100 p-2 rounded">{error}</p>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const { id } = useParams();
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">¡Oops!</strong>
      <span className="block sm:inline"> No se pudo encontrar el Pokémon con el ID o nombre "{id}".</span>
    </div>
  );
}