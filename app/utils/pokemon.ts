export interface pokemonSimple {
  name: string;
  url: string;
  id?: number;
}

export async function obtenerListaPokemon(pagina: number = 1) {
  const limite = 20;
  const offset = (pagina - 1) * limite;
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`);
  const datos = await respuesta.json();
  
  return {
    pokemons: datos.results.map((pokemon: pokemonSimple, index: number) => ({
      ...pokemon,
      id: offset + index + 1
    })),
    totalCount: datos.count
  };
}

export async function obtenerDetallePokemon(nombreOId: string) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreOId.toLowerCase()}/`);
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    
    return {
      id: datos.id,
      nombre: datos.name,
      imagen: datos.sprites.front_default,
      tipo: datos.types[0].type.name,
      peso: datos.weight / 10, // Convertimos a kg
      altura: datos.height,
    };
  } catch (error) {
    console.error("Error al obtener detalles del Pokémon:", error);
    return null;
  }
}