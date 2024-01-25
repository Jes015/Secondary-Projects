export interface ResponsePokeAPI {
  count: number;
  next: string;
  previous: null;
  results: PokemonRef[];
}

export interface PokemonRef {
  name: string;
  url: string;
}
