import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { obtenerListaPokemon, pokemonSimple } from '~/utils/pokemon';

export const meta: MetaFunction = () => {
  return [
    { title: "Pokémon App" },
    { name: "description", content: "Explore Pokémon with sounds!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || '1');
  
  const { pokemons, totalCount } = await obtenerListaPokemon(page);
  
  return json({ 
    pokemons, 
    totalCount,
    page 
  });
}

export default function App() {
  const { pokemons, totalCount, page } = useLoaderData<typeof loader>();
  const totalPages = Math.ceil(totalCount / 20);

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-red-600 text-white text-center py-4">
            <h1 className="text-3xl font-bold">Pokémon API</h1>
          </header>
          
          <div className="flex w-full">
            {/* Menú de Pokémones */}
            <div className="w-1/3 p-4 bg-white border-r">
              {pokemons.map((pokemon: pokemonSimple) => (
                <Link 
                  key={pokemon.id} 
                  to={`/pokemon/${pokemon.name}`}
                  className="block mb-2"
                >
                  <div className="bg-gray-500 p-1 rounded-lg flex items-center space-x-4 hover:bg-gray-600 transition-colors">
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} 
                      alt={pokemon.name} 
                      className="h-10"
                    />
                    <p className="capitalize text-lg font-medium flex-grow text-white">{pokemon.name}</p>
                    <span className="text-gray-100 font-semibold">#{pokemon.id}</span>
                  </div>
                </Link>
              ))}
              
              <div className="mt-4 flex justify-between items-center">
                {page > 1 && (
                  <Link 
                    to={`/?page=${page - 1}`} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                <span className="text-gray-600">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages && (
                  <Link 
                    to={`/?page=${page + 1}`} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>

            {/* Área de Detalles de Pokémon */}
            <div className="w-2/3 p-4">
              <Outlet />
            </div>
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}

// Opcional: Si quieres un mensaje por defecto cuando no hay un Pokémon seleccionado
export function ErrorBoundary() {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">¡Oops!</strong>
      <span className="block sm:inline"> Algo salió mal. Por favor, intenta de nuevo.</span>
    </div>
  );
}