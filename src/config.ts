const config: Config = {
  programId: "4HeVTFdGHgSzjmexn7k1zpJxFsBymJ7FcpwJzGARvswN",
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
