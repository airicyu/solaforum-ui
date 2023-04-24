import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export type PostWithReplyDto = {
  id: number;
  author: PublicKey;
  title: string;
  content: string;
  replies: ReplyDto[];
};

export type ReplyDto = {
  id: number;
  time: number | null;
  author: PublicKey;
  content: string;
};
