import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export type PostDto = {
  id: BN;
  author: PublicKey;
  title: string;
  content: string;
  replies: number;
};
