import React, { useEffect, useState } from "react";
import {
  useWalletConnect,
  QRCodeModal,
  BroadcastResult,
} from "@provenanceio/walletconnect-js";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [bridge, setBridge] = useState(
    "wss://test.figure.tech/service-wallet-connect-bridge/ws/external"
  );
  const [signingComplete, setSigningComplete] = useState(false);
  const [result, setResult] = useState<BroadcastResult | "">("");
  const { walletConnectService, walletConnectState } = useWalletConnect();
  const {
    connected,
    address,
    walletInfo,
    bridge: connectedBridge,
    connector,
  } = walletConnectState;
  const bridgeOptions = [
    "wss://www.figure.tech/service-wallet-connect-bridge/ws/external",
    "wss://test.figure.tech/service-wallet-connect-bridge/ws/external",
    "https://bridge.walletconnect.org",
    "wss://bridge.aktionariat.com:8887",
  ];

  useEffect(() => {
    // Onload, log the current connector
    console.log("App.tsx | useEffect() | connector: ", connector);
  }, [connector]);
  useEffect(() => {
    console.log(
      "App.tsx | useEffect() | walletConnectState: ",
      walletConnectState
    );
  }, [walletConnectState]);

  // Attempt to re-create Matt H. wcjs issue here
  useEffect(() => {
    if (isOpen) {
      setResult("");
      setError("");
      setSigningComplete(false);
      setIsOpen(false);
      walletConnectService
        .signMessage("test")
        .then((data) => {
          if (!data.error) {
            setSigningComplete(true);
            setResult(data);
          } else {
            setError(data.error);
          }
        })
        .catch((e) => {
          console.error("ERR", e);
          setError(e);
        });
    }
  }, [isOpen, walletConnectService]);

  const handleConnect = () => {
    walletConnectService.connect({ bridge });
  };
  const handleDisconnect = () => {
    walletConnectService.disconnect();
  };
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>WCJS TEST APP</h1>
        {connected && (
          <div>
            <div>Connected!</div>
            <hr />
            <div>
              <h3>WalletConnectState:</h3>
              <div>
                <b>Wallet Name: </b>
                {walletInfo.name || "N/A"}
              </div>
              <div>
                <b>Address: </b>
                {address || "N/A"}
              </div>
              <div>
                <b>Bridge: </b>
                {connectedBridge || "N/A"}
              </div>
              <hr />
              <h3>Connector:</h3>
              <div>
                <b>Bridge: </b>
                {connector?.bridge || "N/A"}
              </div>
              <div>
                <b>Handshake Topic: </b>
                {connector?.handshakeTopic || "N/A"}
              </div>
              <div>
                <b>Handshake ID: </b>
                {connector?.handshakeId || "N/A"}
              </div>
              <div>
                <b>Client ID: </b>
                {connector?.clientId || "N/A"}
              </div>
              <div>
                <b>Peer ID: </b>
                {connector?.peerId || "N/A"}
              </div>
            </div>
            <hr />
            <button onClick={handleDisconnect}>Disconnect</button>
            <button onClick={toggleIsOpen}>Sign Message</button>
            {error && <div>Error: {error}</div>}
            {signingComplete && <div>Signing Complete!</div>}
            {result && (
              <div
                style={{
                  maxWidth: "80%",
                  margin: "20px auto",
                  lineBreak: "anywhere",
                }}
              >
                {" "}
                {`Result: ${JSON.stringify(result)}`}
              </div>
            )}
          </div>
        )}
        <div>
          <div>New Connection Bridge</div>
          <select
            value={bridge}
            onChange={({ target }) => setBridge(target.value)}
          >
            {bridgeOptions.map((bridgeUrl) => (
              <option key={bridgeUrl}>{bridgeUrl}</option>
            ))}
          </select>
          <div>
            <button onClick={handleConnect}>Connect</button>
          </div>
        </div>
      </header>
      <QRCodeModal walletConnectService={walletConnectService} />
    </div>
  );
}

export default App;
