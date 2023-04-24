import * as anchor from "@coral-xyz/anchor";
import { PdaAccounts } from "./pdaAccounts";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { Solaforum } from "../types/solaforum";

export class ProgramService {
  program: anchor.Program<Solaforum>;
  pdaAccounts: PdaAccounts;

  constructor(program: anchor.Program<Solaforum>, pdaAccounts: PdaAccounts) {
    this.program = program;
    this.pdaAccounts = pdaAccounts;
  }

  runInitialize = async () => {
    return this.program.methods
      .initialize()
      .accounts({
        earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
      })
      .rpc();
  };

  runInitializeUser = async (user: PublicKey) => {
    return this.program.methods
      .initializeUser()
      .accounts({
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
      })
      .rpc();
  };

  reserveEarthId = async (user: PublicKey) => {
    return this.program.methods
      .reserveEarthId()
      .accounts({
        earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
      })
      .rpc();
  };

  createEarth = async (user: PublicKey, earthId: BN, name: string) => {
    return this.program.methods
      .createEarth({
        name,
      })
      .accounts({
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
        earth: this.pdaAccounts.earth(earthId)[0],
        postIdCounter: this.pdaAccounts.postIdCounter(earthId)[0],
      })
      .rpc();
  };

  reservePostId = async (user: PublicKey, earthId: BN) => {
    return this.program.methods
      .reservePostId(earthId)
      .accounts({
        earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
        postIdCounter: this.pdaAccounts.postIdCounter(earthId)[0],
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
      })
      .rpc();
  };

  createPost = async (
    user: PublicKey,
    earthId: BN,
    postId: BN,
    title: string,
    content: string
  ) => {
    return this.program.methods
      .createPost({
        earthId: earthId,
        title,
        content,
      })
      .accounts({
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
        post: this.pdaAccounts.post(earthId, postId)[0],
        replyIdCounter: this.pdaAccounts.replyIdCounter(earthId, postId)[0],
      })
      .rpc();
  };

  reserveReplyId = async (user: PublicKey, earthId: BN, postId: BN) => {
    return this.program.methods
      .reserveReplyId({
        earthId: earthId,
        postId: postId,
      })
      .accounts({
        earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
        postIdCounter: this.pdaAccounts.postIdCounter(earthId)[0],
        replyIdCounter: this.pdaAccounts.replyIdCounter(earthId, postId)[0],
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
      })
      .rpc();
  };

  createReply = async (
    user: PublicKey,
    earthId: BN,
    postId: BN,
    replyId: number,
    content: string
  ) => {
    return this.program.methods
      .createReply({
        earthId: earthId,
        postId: postId,
        content,
      })
      .accounts({
        userReserveReceipt: this.pdaAccounts.userReserveReceipt(user)[0],
        reply: this.pdaAccounts.reply(earthId, postId, replyId)[0],
      })
      .rpc();
  };

  queryEarthIdCounter = async () => {
    return this.program.account.idCounter.fetch(
      this.pdaAccounts.earthIdCounter()[0]
    );
  };

  queryUserReserveReceipt = async (user: PublicKey) => {
    return this.program.account.idReserveReceipt.fetch(
      this.pdaAccounts.userReserveReceipt(user)[0]
    );
  };

  queryEarth = async (earthId: BN) => {
    return this.program.account.earth.fetch(this.pdaAccounts.earth(earthId)[0]);
  };

  queryPostIdCounter = async (earthId: BN) => {
    return this.program.account.idCounter.fetch(
      this.pdaAccounts.postIdCounter(earthId)[0]
    );
  };

  queryPost = async (earthId: BN, postId: BN) => {
    return this.program.account.post.fetch(
      this.pdaAccounts.post(earthId, postId)[0]
    );
  };

  queryReplyIdCounter = async (earthId: BN, postId: BN) => {
    return this.program.account.u8IdCounter.fetch(
      this.pdaAccounts.replyIdCounter(earthId, postId)[0]
    );
  };

  queryReply = async (earthId: BN, postId: BN, replyId: number) => {
    return this.program.account.reply.fetch(
      this.pdaAccounts.reply(earthId, postId, replyId)[0]
    );
  };
}
