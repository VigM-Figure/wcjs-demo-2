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
  const [signingComplete, setSigningComplete] = useState(false);
  const [result, setResult] = useState<BroadcastResult | "">("");
  const { walletConnectService, walletConnectState } = useWalletConnect();
  const { connected } = walletConnectState;

  // Attempt to re-create Matt H. wcjs issue here
  useEffect(() => {
    if (isOpen) {
      setResult("");
      setError("");
      setSigningComplete(false);
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
    walletConnectService.connect();
  };
  const handleDisconnect = () => {
    walletConnectService.disconnect();
  };
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>WCJS TEST APP</h1>
        {connected ? (
          <div>
            <div>Connected!</div>
            <button onClick={handleDisconnect}>disconnect</button>
            <button onClick={toggleIsOpen}>isOpen: {`${isOpen}`}</button>
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
        ) : (
          <button onClick={handleConnect}>connect</button>
        )}
      </header>
      <QRCodeModal walletConnectService={walletConnectService} />
    </div>
  );
}

export default App;
