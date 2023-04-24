import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "antd/dist/reset.css";
import { WalletConnector } from "./contexts/WalletConnector";
import { Web3ContextProvider } from "./contexts/Web3Context";

window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <WalletConnector>
      <Web3ContextProvider>
        <App />
      </Web3ContextProvider>
    </WalletConnector>
  </React.StrictMode>
);
