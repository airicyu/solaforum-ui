const config: Config = {
  programId: "EsqBv3bcnp6iJFmB3JuEKcp12RW34FT7VbvtZYkMg2XT",
  network: "devnet",
  endpoint: {
    devnet: "https://api.devnet.solana.com",
  },
};

export declare type Config = {
  programId: string;
  network: "devnet";
  endpoint: Record<Config["network"], string>;
};

export default config;
