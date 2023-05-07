import { createContext, useState, useEffect, useMemo } from "react";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { Solaforum } from "../types/solaforum";
import { PdaAccounts } from "../core/pdaAccounts";
import { ProgramService } from "../core/progromService";
import { idl } from "../core/idl";
import { ForumService } from "../core/forumService";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import config, { Config } from "../config";
declare type Web3ContextType = {
  // network: Config["network"];
  // endpoint: string;
  connection: web3.Connection;
  anchorWallet?: AnchorWallet;
  userInitialized: boolean;
  anchorProvider: anchor.AnchorProvider;
  program: Program<Solaforum>;
  pdaAccounts: PdaAccounts;
  programService: ProgramService;
  forumService: ForumService;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const Web3ContextProvider = ({ children }: any) => {
  //   network: Config["network"] = config.network;
  //   endpoint: string = config.endpoint[this.network] as string;
  const connection: web3.Connection = useMemo(
    () =>
      new web3.Connection(
        config.endpoint[config.network],
        // "https://solana-devnet.rpc.extrnode.com/",
        //"https://solana-mainnet.rpc.extrnode.com",
        //   web3.clusterApiUrl("mainnet-beta"),
        "confirmed"
      ),
    []
  );

  let anchorWallet = useAnchorWallet();
  let [prevAnchorWallet, setPrevAnchorWallet] = useState<
    AnchorWallet | undefined
  >();

  let [anchorProvider, setAnchorProvider] = useState<anchor.AnchorProvider>(
    new anchor.AnchorProvider(connection, {} as AnchorWallet, {
      commitment: "confirmed",
    })
  );
  let [program, setProgram] = useState<Program<Solaforum>>(
    new anchor.Program<Solaforum>(
      idl as Solaforum,
      config.programId,
      anchorProvider
    )
  );
  let [pdaAccounts, setPdaAccounts] = useState<PdaAccounts>(
    new PdaAccounts(program)
  );
  let [programService, setProgramService] = useState<ProgramService>(
    new ProgramService(program, pdaAccounts)
  );
  let [forumService, setForumService] = useState<ForumService>(
    new ForumService(connection, program, pdaAccounts, programService)
  );
  let [userInitialized, setUserInitialized] = useState<boolean>(false);
  const [isRefreshUserInitStatus, setIsRefreshUserInitStatus] =
    useState<boolean>(false);

  if (prevAnchorWallet !== anchorWallet) {
    console.log("Anchor wallet updated", anchorWallet);
    setPrevAnchorWallet(anchorWallet);
    let _anchorProvider = anchorWallet
      ? new anchor.AnchorProvider(connection, anchorWallet, {
          commitment: "confirmed",
        })
      : new anchor.AnchorProvider(connection, {} as AnchorWallet, {
          commitment: "confirmed",
        });
    setAnchorProvider(_anchorProvider);
    console.log("updated anchorProvider", _anchorProvider);
    setIsRefreshUserInitStatus(true);

    const _program = new anchor.Program<Solaforum>(
      idl as Solaforum,
      config.programId,
      _anchorProvider
    );
    setProgram(_program);
    console.log("updated program", _program);

    const _pdaAccounts = new PdaAccounts(_program);
    setPdaAccounts(_pdaAccounts);

    const _programService = new ProgramService(_program, _pdaAccounts);
    setProgramService(_programService);

    const _forumService = new ForumService(
      connection,
      _program,
      _pdaAccounts,
      _programService
    );
    setForumService(_forumService);
  }

  if (anchorWallet && isRefreshUserInitStatus) {
    (async () => {
      const userInitilaized =
        (await forumService?.checkUserInitialized(anchorWallet.publicKey)) ??
        false;
      setUserInitialized(userInitilaized);
      setIsRefreshUserInitStatus(false);
    })();
  }

  const provider = {
    connection,
    anchorWallet,
    userInitialized,
    anchorProvider,
    program,
    pdaAccounts,
    programService,
    forumService,
  };

  return (
    <Web3Context.Provider value={provider!}>{children}</Web3Context.Provider>
  );
};

export { Web3Context, Web3ContextProvider };
