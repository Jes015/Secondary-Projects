export const envConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  nestPort: process.env.NEST_PORT ?? 3000,
  mongoURL: process.env.MOGODB_URL,
  pokemonLimit: process.env.DEFAULT_POKEMON_LIMIT ?? 7,
});
