import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ViewEarthPosts } from "./pages/ViewEarthPosts";
import { Web3Context } from "./contexts/Web3Context";
import { ViewPost } from "./pages/ViewPost";
// import { WalletConnector } from "./contexts/WalletConnector";
import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { useContext, useCallback, useMemo, useState, useEffect } from "react";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Alert, Button, Input, Modal, Space, message } from "antd";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const router = createHashRouter([
  {
    path: "/",
    element: <ViewEarthPosts></ViewEarthPosts>,
    children: [],
  },
  {
    path: "/post/:postId",
    element: <ViewPost></ViewPost>,
    children: [],
  },
]);

function App() {
  const web3Context = useContext(Web3Context);
  const anchorWallet = useAnchorWallet();

  const [isInitUserModalOpen, setIsInitUserModalOpen] = useState(false);
  const [inputUserName, setInputUserName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [balance, setBalance] = useState<number | null>(null);
  const [refreshBalanceTime, setRefreshBalanceTime] = useState(0);
  let [prevAnchorWallet, setPrevAnchorWallet] = useState<
    AnchorWallet | undefined
  >();

  if (prevAnchorWallet !== anchorWallet) {
    setPrevAnchorWallet(anchorWallet);
    setRefreshBalanceTime(0);
  }

  const initializeUser = useCallback(
    (name: string) => {
      (async () => {
        if (anchorWallet) {
          await web3Context?.forumService?.initializeUser(
            anchorWallet.publicKey,
            name
          );
          web3Context?.refreshUserInitStatus();
        }
      })();
    },
    [anchorWallet, web3Context]
  );

  const userInitNotice = useMemo(() => {
    let userInitNotice = null;
    if (!anchorWallet) {
      userInitNotice = (
        <Space direction="vertical" style={{ width: "500px" }}>
          <Alert
            message="You need to connect wallet to post/reply"
            type="warning"
            showIcon
          />
        </Space>
      );
    } else if (anchorWallet && !web3Context?.userInitialized) {
      console.log("web3Context.userInitialized?", web3Context?.userInitialized);
      userInitNotice = (
        <Space direction="vertical" style={{ width: "500px" }}>
          <Alert
            message="You need to initialize your account to post/reply"
            type="warning"
            showIcon
            action={
              <Button
                size="small"
                type="primary"
                onClick={() => setIsInitUserModalOpen(true)}
              >
                Initialize User
              </Button>
            }
          />
        </Space>
      );
    }
    return userInitNotice;
  }, [anchorWallet, web3Context]);

  const initUserModel = useMemo(
    () => (
      <>
        <Modal
          title="Init User"
          open={isInitUserModalOpen}
          onOk={async (e) => {
            if (anchor.utils.bytes.utf8.encode(inputUserName).length > 30) {
              messageApi.open({
                type: "error",
                content: "Name too long!",
              });
            } else {
              await initializeUser(inputUserName);
              setInputUserName("");
              setIsInitUserModalOpen(false);
            }
          }}
          onCancel={() => {
            setIsInitUserModalOpen(false);
          }}
        >
          <div>
            <div>
              Name: ({anchor.utils.bytes.utf8.encode(inputUserName).length}/30
              bytes)
            </div>
            <div className="gap-space"></div>
            <div
              className={
                anchor.utils.bytes.utf8.encode(inputUserName).length > 30
                  ? "error-highlight"
                  : ""
              }
            >
              <Input
                maxLength={30}
                defaultValue={inputUserName}
                onChange={(e) => {
                  setInputUserName(e.target.value);
                }}
              ></Input>
            </div>
          </div>
        </Modal>
      </>
    ),
    [initializeUser, inputUserName, isInitUserModalOpen, messageApi]
  );

  useEffect(() => {
    const id = setInterval(async () => {
      if (anchorWallet && Date.now() > refreshBalanceTime) {
        setRefreshBalanceTime(Date.now() + 6000);
        const accountBalance = await web3Context?.connection.getBalance(
          anchorWallet.publicKey
        );
        if (accountBalance !== undefined) {
          setBalance(accountBalance / LAMPORTS_PER_SOL);
        }
      }
    }, 1000);

    return () => clearInterval(id);
  }, [anchorWallet, refreshBalanceTime, web3Context?.connection]);

  const requestAirdrop = useCallback(() => {
    if (anchorWallet?.publicKey) {
      (async () => {
        let balance = await web3Context?.connection.getBalance(
          anchorWallet.publicKey
        );

        if (balance !== undefined) {
          messageApi.open({
            type: "info",
            content: `Your wallet ${anchorWallet.publicKey.toString()} currently has ${
              balance / LAMPORTS_PER_SOL
            } SOL. Now trying to airdrop 2 SOL for you...`,
          });

          try {
            await web3Context?.connection.requestAirdrop(
              anchorWallet.publicKey,
              2 * LAMPORTS_PER_SOL
            );
            balance = await web3Context?.connection.getBalance(
              anchorWallet.publicKey
            );

            if (balance !== undefined) {
              messageApi.open({
                type: "info",
                content: `Now Your wallet ${anchorWallet.publicKey.toString()} currently has ${
                  balance / LAMPORTS_PER_SOL
                } SOL.`,
              });
            }
          } catch (e) {
            messageApi.open({
              type: "error",
              content: `Airdrop failed! Please try again some time later...`,
            });
          }
        }
      })();
    }
  }, [anchorWallet?.publicKey, messageApi, web3Context?.connection]);

  return (
    <div className="App">
      <div style={{ paddingLeft: 20 }}>
        <header className="App-header">
          <h1 style={{ color: "#778899" }}>SolaForum</h1>
          <div>{userInitNotice}</div>
          <div style={{ float: "right", paddingRight: 20 }}>
            <div style={{ float: "right" }}>
              <WalletMultiButton></WalletMultiButton>
            </div>
            <div style={{ clear: "both" }}></div>
            <div style={{ float: "right" }}>
              <Button onClick={requestAirdrop}>Request airdrop</Button>{" "}
            </div>
            <div style={{ clear: "both" }}></div>
          </div>
          <div style={{ float: "right", paddingRight: 20 }}>
            <div>SOL balance: {balance}</div>
          </div>
        </header>
        <div style={{ paddingLeft: 20 }}>
          <RouterProvider router={router} />
        </div>
      </div>
      {initUserModel}
      {contextHolder}
    </div>
  );
}

export default App;
