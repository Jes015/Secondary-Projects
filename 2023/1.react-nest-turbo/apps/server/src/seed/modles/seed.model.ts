interface PokeResponse {
    count: number
    next: string
    previous: null
    results: PokemonResult[]
}

interface PokemonResult {
    name: string
    url: string
}

export type { PokeResponse, PokemonResult }
