import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ViewEarthPosts } from "./pages/ViewEarthPosts";
import { Web3Context } from "./contexts/Web3Context";
import { ViewPost } from "./pages/ViewPost";
// import { WalletConnector } from "./contexts/WalletConnector";
import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { useContext, useCallback, useMemo, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Alert, Button, Input, Modal, Space, message } from "antd";
import * as anchor from "@coral-xyz/anchor";

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

  const initializeUser = useCallback(
    (name: string) => {
      (async () => {
        if (anchorWallet) {
          await web3Context?.forumService?.initializeUser(
            anchorWallet.publicKey,
            name
          );
        }
      })();
    },
    [anchorWallet, web3Context?.forumService]
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

  return (
    <div className="App">
      <header className="App-header">
        <div>{userInitNotice}</div>
        <div style={{ float: "right" }}>
          <WalletMultiButton></WalletMultiButton>
        </div>
        <div style={{ clear: "both" }}></div>

        <RouterProvider router={router} />
      </header>
      {initUserModel}
      {contextHolder}
    </div>
  );
}

export default App;
