import { Program, Wallet } from "@coral-xyz/anchor";
import { PdaAccounts } from "./pdaAccounts";
import { ProgramService } from "./progromService";
import BN from "bn.js";
import { Connection, PublicKey } from "@solana/web3.js";
import _ from "lodash";
import { EarthDto } from "./../models/EarthDto";
import { PostDto } from "./../models/PostDto";
import { PostWithReplyDto, ReplyDto } from "./../models/ReplyDto";
import { Solaforum } from "./../types/solaforum";
import * as anchor from "@coral-xyz/anchor";
import lscache from "lscache";

export class ForumService {
  connection: Connection;
  program: Program<Solaforum>;
  pdaAccounts: PdaAccounts;
  programService: ProgramService;
  constructor(
    connection: Connection,
    program: Program<Solaforum>,
    pdaAccounts: PdaAccounts,
    programService: ProgramService
  ) {
    this.connection = connection;
    this.program = program;
    this.pdaAccounts = pdaAccounts;
    this.programService = programService;
  }

  async initialize() {
    const initializeTrxHash = await this.programService.runInitialize();
    console.log(`run initialize Trx: ${initializeTrxHash}`);
    return initializeTrxHash;
  }

  async initializeUser(user: PublicKey) {
    const initializeUserTrxHash = await this.programService.runInitializeUser(
      user
    );
    console.log(`run initializeUser Trx: ${initializeUserTrxHash}`);
    return initializeUserTrxHash;
  }

  async checkUserInitialized(user: PublicKey) {
    try {
      const userReserveReceipt =
        await this.programService.queryUserReserveReceipt(user);
      console.log("userReserveReceipt", userReserveReceipt);
      return true;
    } catch (e: any) {
      if (e?.message?.startsWith("Account does not exist or has no data")) {
        return false;
      } else {
        throw e;
      }
    }
  }

  async createEarth(user: PublicKey, name: string) {
    if (anchor.utils.bytes.utf8.encode(name).length > 50) {
      throw new Error(
        "Earth name too long! Max allowed is 50 bytes utf-8 string"
      );
    }
    /**
     * Reserve Earth
     */
    const reserveEarthIdTrx = await this.programService.reserveEarthId(user);
    console.log(`run reserveEarthId Trx: ${reserveEarthIdTrx}`);
    const userReserveEarthIdReceipt =
      await this.programService.queryUserReserveReceipt(user);
    console.log(
      `userReserveEarthIdReceipt: ${JSON.stringify(userReserveEarthIdReceipt)}`
    );
    const earthId = userReserveEarthIdReceipt.earthId;
    /**
     * Create Earth
     */
    const createEarthTrxHash = await this.programService.createEarth(
      user,
      new BN(earthId),
      "Earth0"
    );
    console.log(`run createEarth Trx: ${createEarthTrxHash}`);
    const earth = await this.programService.queryEarth(new BN(earthId));
    console.log(`earth: ${JSON.stringify(earth)}`);
    return {
      trxHash: createEarthTrxHash,
      earthId: earth.id,
    };
  }

  async createPost(
    user: PublicKey,
    earthId: BN,
    title: string,
    content: string
  ) {
    if (anchor.utils.bytes.utf8.encode(title).length > 50) {
      throw new Error(
        "Post title too long! Max allowed is 50 bytes utf-8 string"
      );
    }
    if (anchor.utils.bytes.utf8.encode(content).length > 255) {
      throw new Error(
        "Post content too long! Max allowed is 255 bytes utf-8 string"
      );
    }
    /**
     * Reserve Post
     */
    const reservePostIdTrx = await this.programService.reservePostId(
      user,
      earthId
    );

    console.log(`run reservePostId Trx: ${reservePostIdTrx}`);
    const userReservePostIdReceipt =
      await this.programService.queryUserReserveReceipt(user);
    console.log(
      `userReservePostIdReceipt: ${JSON.stringify(userReservePostIdReceipt)}`
    );
    const postId = userReservePostIdReceipt.postId;
    /**
     * Create Post
     */
    const createPostTrxHash = await this.programService.createPost(
      user,
      new BN(userReservePostIdReceipt.earthId),
      new BN(postId),
      title,
      content
    );
    console.log(`run createPost Trx: ${createPostTrxHash}`);
    const post = await this.programService.queryPost(
      new BN(earthId),
      new BN(postId)
    );

    return {
      trxHash: createPostTrxHash,
      postId: post.id,
    };
  }

  async createReply(user: PublicKey, earthId: BN, postId: BN, content: string) {
    if (anchor.utils.bytes.utf8.encode(content).length > 255) {
      throw new Error(
        "Reply content too long! Max allowed is 255 bytes utf-8 string"
      );
    }
    /**
     * Reserve Post
     */
    const reserveReplyIdTrx = await this.programService.reserveReplyId(
      user,
      earthId,
      postId
    );
    console.log(`run reserveReplyId Trx: ${reserveReplyIdTrx}`);
    const userReserveReplyIdReceipt =
      await this.programService.queryUserReserveReceipt(user);
    console.log(
      `userReserveReplyIdReceipt: ${JSON.stringify(userReserveReplyIdReceipt)}`
    );
    const replyId = new BN(userReserveReplyIdReceipt.replyId).toNumber();
    /**
     * Create Reply
     */
    const createReplyTrxHash = await this.programService.createReply(
      user,
      new BN(earthId),
      new BN(postId),
      replyId,
      content
    );
    console.log(`run createReply Trx: ${createReplyTrxHash}`);
    const reply = await this.programService.queryReply(
      new BN(earthId),
      new BN(postId),
      replyId
    );
    console.log(`reply: ${JSON.stringify(reply)}`);
    return {
      trxHash: createReplyTrxHash,
      replyId: reply.id,
    };
  }

  async getEarth(earthId: BN): Promise<EarthDto> {
    const earth = await this.programService.queryEarth(earthId);
    const postIdCounter = await this.programService.queryPostIdCounter(earthId);

    return {
      id: new BN(earth.id),
      name: earth.name,
      postCount: new BN(postIdCounter.nextId).toNumber() - 1,
    };
  }

  async _getPostWithCache(earthId: BN, postId: BN): Promise<any> {
    const cacheKey = `e:${earthId.toString()}:p:${postId.toString()}`;
    const cachedValue = lscache.get(cacheKey);
    if (cachedValue) {
      // console.log(`cacheKey: ${cacheKey}, cachedValue: `, cachedValue);
      const basePost = JSON.parse(cachedValue);
      return {
        id: new BN(basePost.id),
        author: new PublicKey(basePost.author),
        title: basePost.title,
      };
    } else {
      let post = await this.programService.queryPost(earthId, postId);
      if (post) {
        lscache.set(cacheKey, JSON.stringify(post), 60 * 24);
      }
      return post;
    }
  }

  async getEarthPosts(earthId: BN): Promise<PostDto[]> {
    const postIdCounter = await this.programService.queryPostIdCounter(earthId);
    const maxId = new BN(postIdCounter.nextId).toNumber() - 1;
    const queryTasks: (() => Promise<PostDto>)[] = [];
    const results: PostDto[] = [];
    for (let i = maxId; i > Math.max(0, maxId - 10); i--) {
      queryTasks.push(async () => {
        const post = await this._getPostWithCache(earthId, new BN(i)); //await this.programService.queryPost(earthId, new BN(i));
        const replyIdCounter = await this.programService.queryReplyIdCounter(
          earthId,
          post.id
        );
        return {
          id: new BN(post.id),
          author: post.author,
          title: post.title,
          content: post.content,
          replies: new BN(replyIdCounter.nextId).toNumber() - 1,
        };
      });
    }
    const queryTasksBatches = _.chunk(queryTasks, 5);
    for (let i = 0; i < queryTasksBatches.length; i++) {
      const tasks = await Promise.allSettled(
        queryTasksBatches[i].map((task) => task())
      );
      tasks
        .filter((_) => _.status !== "fulfilled") // eslint-disable-next-line no-loop-func
        .map((_) => _ as PromiseRejectedResult)
        .forEach((e) => console.error(e));

      results.push(
        ...tasks
          .filter((_) => _.status === "fulfilled")
          // eslint-disable-next-line no-loop-func
          .map((_) => (_ as PromiseFulfilledResult<PostDto>).value)
      );
    }

    return results;
  }

  async _getPostReplyWithCache(
    earthId: BN,
    postId: BN,
    maxId: number
  ): Promise<any> {
    const cacheKey = `e:${earthId.toString()}:p:${postId.toString()}:r_*`;
    const cachedValue = lscache.get(cacheKey);
    if (cachedValue) {
      // console.log(`cacheKey: ${cacheKey}, cachedValue: `, cachedValue);
      const baseReplies = JSON.parse(cachedValue);
      let cacheMaxId = 0;
      if (baseReplies[baseReplies.length - 1]?.id > 0) {
        cacheMaxId = baseReplies[baseReplies.length - 1]?.id;
      }

      if (cacheMaxId < maxId) {
        console.log("_getReplies since ", cacheMaxId + 1);
        let replies = await this._getReplies(earthId, postId, cacheMaxId + 1);
        baseReplies.push(...JSON.parse(JSON.stringify(replies)));
      }

      const allReplies = baseReplies.map((baseReply: any) => {
        return {
          id: baseReply.id,
          time: baseReply.time ?? null,
          author: new PublicKey(baseReply.author),
          content: baseReply.content,
        };
      });

      if (cacheMaxId < maxId) {
        lscache.set(cacheKey, JSON.stringify(allReplies), 60 * 24);
      }
      return allReplies;
    } else {
      let replies = await this._getReplies(earthId, postId, 1);
      if (replies) {
        lscache.set(cacheKey, JSON.stringify(replies), 60 * 24);
      }
      return replies;
    }
  }

  async getPostReplies(earthId: BN, postId: BN): Promise<PostWithReplyDto> {
    const replyIdCounter = await this.programService.queryReplyIdCounter(
      earthId,
      postId
    );
    const maxId = new BN(replyIdCounter.nextId).toNumber() - 1;
    const post = await this.programService.queryPost(earthId, postId);
    // pdaAccounts.post(earthId, new BN(1))[0].toString())
    //     // const acc = await connection.getAccountInfo(new PublicKey('9pyDRizbn9d3uZi7CpGUj2umBqAbZu7AbCyzyvKQKoEX'))
    //     const trx = await connection.getSignaturesForAddress(new PublicKey('9pyDRizbn9d3uZi7CpGUj2umBqAbZu7AbCyzyvKQKoEX'))
    const postAccount = this.pdaAccounts.post(earthId, postId)[0];
    const postTrxHash = (
      await this.connection.getSignaturesForAddress(postAccount)
    )[0]?.signature;

    const postTrx = await this.connection.getTransaction(postTrxHash, {
      maxSupportedTransactionVersion: 0,
    });

    const postContent =
      postTrx?.meta?.logMessages
        ?.find((log) => log.startsWith("Program log: Post content: "))
        ?.replace("Program log: Post content: ", "") ?? "";

    const replyContents = (await this._getPostReplyWithCache(
      earthId,
      postId,
      maxId
    )) as ReplyDto[];

    return {
      id: post.id.toNumber(),
      author: post.author,
      title: post.title,
      content: postContent?.replace("Program log: Post content:", ""),
      replies: replyContents,
    };
  }

  async getReplies(
    earthId: BN,
    postId: BN,
    startFrom: number
  ): Promise<ReplyDto[]> {
    const replyIdCounter = await this.programService.queryReplyIdCounter(
      earthId,
      postId
    );
    const maxId = new BN(replyIdCounter.nextId).toNumber() - 1;
    return (
      (await this._getPostReplyWithCache(earthId, postId, maxId)) as ReplyDto[]
    ).filter((reply) => reply.id >= startFrom);
  }

  // no cache
  async _getReplies(
    earthId: BN,
    postId: BN,
    startFrom: number
  ): Promise<ReplyDto[]> {
    const replyIdCounter = await this.programService.queryReplyIdCounter(
      earthId,
      postId
    );
    const maxId = new BN(replyIdCounter.nextId).toNumber() - 1;
    const queryTasks: (() => Promise<string>)[] = [];
    const replyHashes: string[] = [];
    for (let i = startFrom; i <= maxId; i++) {
      queryTasks.push(async () => {
        const replyAccount = this.pdaAccounts.reply(earthId, postId, i)[0];
        const replyTrx = (
          await this.connection.getSignaturesForAddress(replyAccount)
        )[0];
        //const reply = await this.programService.queryReply(earthId, postId, i)
        return replyTrx.signature;
      });
    }
    const queryTasksBatches = _.chunk(queryTasks, 5);
    for (let i = 0; i < queryTasksBatches.length; i++) {
      const tasks = await Promise.allSettled(
        queryTasksBatches[0].map((task) => task())
      );

      tasks
        .filter((_) => _.status !== "fulfilled") // eslint-disable-next-line no-loop-func
        .map((_) => _ as PromiseRejectedResult)
        .forEach((e) => console.error(e));

      replyHashes.push(
        ...tasks
          .filter((_) => _.status === "fulfilled")
          .map((_) => (_ as PromiseFulfilledResult<string>).value)
      );
    }
    const trxs = await this.connection.getTransactions([...replyHashes], {
      maxSupportedTransactionVersion: 0,
    });

    const replyContents = trxs.map((trx) => {
      const replyId =
        trx?.meta?.logMessages
          ?.find((log) => log.startsWith("Program log: Reply ID: "))
          ?.replace("Program log: Reply ID: ", "") ?? "";
      const replyAuthor =
        trx?.meta?.logMessages
          ?.find((log) => log.startsWith("Program log: Author: "))
          ?.replace("Program log: Author: ", "") ?? "";
      const content =
        trx?.meta?.logMessages
          ?.find((log) => log.startsWith("Program log: Reply content: "))
          ?.replace("Program log: Reply content: ", "") ?? "";
      const time = trx?.blockTime;
      return {
        id: +replyId,
        time: time ?? null,
        author: new PublicKey(replyAuthor),
        content,
      };
    });
    return replyContents;
  }
}
