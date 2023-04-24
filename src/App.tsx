import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ViewEarthPosts } from "./pages/ViewEarthPosts";
import { Web3Context, Web3ContextProvider } from "./contexts/Web3Context";
import { ViewPost } from "./pages/ViewPost";
import { WalletConnector } from "./contexts/WalletConnector";
import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { useContext, useEffect, useCallback, useMemo } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Alert, Button, Space } from "antd";

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

  const initializeUser = useCallback(() => {
    (async () => {
      if (anchorWallet) {
        await web3Context?.forumService?.initializeUser(anchorWallet.publicKey);
      }
    })();
  }, [anchorWallet, web3Context?.forumService]);

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
              <Button size="small" type="primary" onClick={initializeUser}>
                Initialize User
              </Button>
            }
          />
        </Space>
      );
    }
    return userInitNotice;
  }, [anchorWallet, initializeUser, web3Context]);

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
    </div>
  );
}

export default App;
