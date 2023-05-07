import {
  BaseSignerWalletAdapter,
  WalletNotConnectedError,
  WalletReadyState,
  isVersionedTransaction,
  WalletName,
} from "@solana/wallet-adapter-base";
import {
  TransactionVersion,
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const walletName = "Test Local Wallet" as WalletName<"Test Local Wallet">;

export class TestWalletAdapter extends BaseSignerWalletAdapter {
  name = walletName;
  url = "https://github.com/solana-labs/wallet-adapter#usage";
  icon =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNCAxMC42djIuN2wtOS41IDE2LjVoLTQuNmw2LTEwLjVhMi4xIDIuMSAwIDEgMCAyLTMuNGw0LjgtOC4zYTQgNCAwIDAgMSAxLjMgM1ptLTQuMyAxOS4xaC0uNmw0LjktOC40djQuMmMwIDIuMy0yIDQuMy00LjMgNC4zWm0yLTI4LjRjLS4zLS44LTEtMS4zLTItMS4zaC0xLjlsLTIuNCA0LjNIMzBsMS43LTNabS0zIDVoLTQuNkwxMC42IDI5LjhoNC43TDI4LjggNi40Wk0xOC43IDBoNC42bC0yLjUgNC4zaC00LjZMMTguNiAwWk0xNSA2LjRoNC42TDYgMjkuOEg0LjJjLS44IDAtMS43LS4zLTIuNC0uOEwxNSA2LjRaTTE0IDBIOS40TDcgNC4zaDQuNkwxNCAwWm0tMy42IDYuNEg1LjdMMCAxNi4ydjhMMTAuMyA2LjRaTTQuMyAwaC40TDAgOC4ydi00QzAgMiAxLjkgMCA0LjMgMFoiIGZpbGw9IiM5OTQ1RkYiLz48L3N2Zz4=";
  supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set([
    "legacy",
    0,
  ]);

  /**
   * Storing a keypair locally like this is not safe because any application using this adapter could retrieve the
   * secret key, and because the keypair will be lost any time the wallet is disconnected or the window is refreshed.
   */
  private _keypair: Keypair | null = null;

  constructor() {
    super();
    console.warn(
      "Your application is presently configured to use the `UnsafeBurnerWalletAdapter`. " +
        "Find and remove it, then replace it with a list of adapters for " +
        "wallets you would like your application to support. See " +
        "https://github.com/solana-labs/wallet-adapter#usage for an example."
    );
  }

  get connecting() {
    return false;
  }

  get publicKey() {
    return this._keypair && this._keypair.publicKey;
  }

  get readyState() {
    return WalletReadyState.Loadable;
  }

  async connect(): Promise<void> {
    const testWalletSecretKey = localStorage.getItem("testWalletSecretKey");
    if (testWalletSecretKey) {
      const secretKey = bs58.decode(testWalletSecretKey);
      this._keypair = Keypair.fromSecretKey(secretKey);
    } else {
      this._keypair = new Keypair();
      localStorage.setItem(
        "testWalletSecretKey",
        bs58.encode(this._keypair.secretKey)
      );
    }
    this.emit("connect", this._keypair.publicKey);
  }

  async disconnect(): Promise<void> {
    this._keypair = null;
    this.emit("disconnect");
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T> {
    alert(
      "Test wallet would auto-signed the transaction for you! If you want real wallet experience, Plese use Phantom wallet."
    );
    if (!this._keypair) throw new WalletNotConnectedError();

    if (isVersionedTransaction(transaction)) {
      transaction.sign([this._keypair]);
    } else {
      transaction.partialSign(this._keypair);
    }

    return transaction;
  }
}
