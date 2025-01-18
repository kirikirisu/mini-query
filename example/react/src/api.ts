export const getTodoQueryKey = "getTodo";
export async function getTodo() {
  const response = await fetch("https://dummyjson.com/todos");
  return await response.json();
}

export const getPokemonKey = "getPokemon";
export async function getPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  return await response.json();
}
