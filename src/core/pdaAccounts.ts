import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { Solaforum } from "../types/solaforum";
import { Buffer } from "buffer";

const fromU64 = (data: BN): Buffer => {
  return data.toArrayLike(Buffer, "le", 8);
};

export class PdaAccounts {
  program: anchor.Program<Solaforum>;
  constructor(program: anchor.Program<Solaforum>) {
    this.program = program;
  }

  earthIdCounter() {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("earth_id_counter")],
      this.program.programId
    );
  }

  userReserveReceipt(user: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("user_reserve_receipt"), user.toBuffer()],
      this.program.programId
    );
  }

  earth(earthId: BN) {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("earth"), fromU64(earthId)],
      this.program.programId
    );
  }

  postIdCounter(earthId: BN) {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("post_id_counter"), fromU64(earthId)],
      this.program.programId
    );
  }

  post(earthId: BN, postId: BN) {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("post"),
        fromU64(earthId),
        fromU64(postId),
      ],
      this.program.programId
    );
  }

  replyIdCounter(earthId: BN, postId: BN) {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("reply_id_counter"),
        fromU64(earthId),
        fromU64(postId),
      ],
      this.program.programId
    );
  }

  reply(earthId: BN, postId: BN, replyId: number) {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("reply"),
        fromU64(earthId),
        fromU64(postId),
        Uint8Array.from([replyId]),
      ],
      this.program.programId
    );
  }
}
