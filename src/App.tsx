import React, { useEffect, useState } from "react";
import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES,
} from "@provenanceio/walletconnect-js";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [initialDisconnect, setInitialDisconnect] = useState(true);
  const { walletConnectService, walletConnectState } = useWalletConnect();
  const { connected } = walletConnectState;

  // Testing to see walletConnectState values on load
  useEffect(() => {
    if (initialDisconnect) {
      setInitialDisconnect(false);
      if (connected) {
        console.log(
          "walletConnectState.connector: ",
          walletConnectState.connector
        );

        walletConnectService.disconnect();
      }
    }
  }, [walletConnectState, walletConnectService, connected, initialDisconnect]);

  useEffect(() => {
    const connected = (data: any) => {
      console.log("WINDOW_MESSAGES.CONNECTED EVENT!: ", data);
    };
    if (initialLoad) {
      setInitialLoad(false);
      console.log("Adding WC listeners");
      walletConnectService.addListener(WINDOW_MESSAGES.CONNECTED, connected);
    }
    return () => {
      console.log("Removing WC listeners");
      walletConnectService.removeListener(WINDOW_MESSAGES.CONNECTED, connected);
    };
  }, []);

  const handleConnect = () => {
    walletConnectService.connect();
  };
  const handleDisconnect = () => {
    walletConnectService.disconnect();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {!connected && <button onClick={handleConnect}>connect</button>}
        {connected && (
          <div>
            <div>Connected!</div>
            <button onClick={handleDisconnect}>disconnect</button>
          </div>
        )}
      </header>
      <QRCodeModal walletConnectService={walletConnectService} />
    </div>
  );
}

export default App;
