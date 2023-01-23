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
  const { connected, connector } = walletConnectState;
  const [walletconnectStorage, setWalletConnectStorage] = useState<
    typeof connector | null
  >();
  // Mock data
  const mockConnector = {
    connected: true,
    accounts: [
      {
        publicKey: "A5uhrTePwwKJVnOqwYGMGSnPVE8QIKF76iR+5x7RgZOU",
        address: "tp1ka6dv5lmm50g0n7lqhk29dj98ra876d2ajh4g6",
        jwt: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJBNXVoclRlUHd3S0pWbk9xd1lHTUdTblBWRThRSUtGNzZpUis1eDdSZ1pPVSIsImlzcyI6InByb3ZlbmFuY2UuaW8iLCJpYXQiOjE2NzQ1MDgyOTksImV4cCI6MTY3NDU5NDY5OSwiYWRkciI6InRwMWthNmR2NWxtbTUwZzBuN2xxaGsyOWRqOThyYTg3NmQyYWpoNGc2In0.1qAMY9g9ebUrOSU5hM2vPQyOHN6sCJEVKsfd3pNzNXxWwHBQQmXlYd1yBDpSrtaRaT7FuTsPQ1ARyv9oC3nIzA",
        walletInfo: { id: "id", name: "MorleyAccount01", coin: "coin" },
      },
    ],
    chainId: "pio-testnet-1",
    bridge: "wss://figure.tech/service-wallet-connect-bridge/ws/external",
    key: "4b353453f56253667ca067dc52bf1a0435c793d8de719138f8b6f81084f9a880",
    clientId: "c86a81a2-619c-4bbd-b404-120c26541e56",
    clientMeta: {
      description: "Web site created using create-react-app",
      url: "http://localhost:3000",
      icons: [
        "http://localhost:3000/favicon.ico",
        "http://localhost:3000/logo192.png",
      ],
      name: "React App",
    },
    peerId: "bb0724fa-cd70-40ba-91ed-ce082817f58f",
    peerMeta: {
      description: "Figure Wallet",
      url: "chrome-extension://bdggkhpjhpejibpfjdcnnnmbkgliffmi",
      icons: [],
      name: "Figure Wallet",
    },
    handshakeId: 1674508295846246,
    handshakeTopic: "5270089f-0331-4f0e-bde9-37a52b4474d7",
  };

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
    walletConnectService.connect();
  };
  const handleDisconnect = () => {
    walletConnectService.disconnect();
  };
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const addMockToStorage = () => {
    window.localStorage.setItem("walletconnect", JSON.stringify(mockConnector));
  };
  const getStorageData = () => window.localStorage.getItem("walletconnect");

  const showStorageHandshakeTopic = () => {
    const existingConnectorData = getStorageData();
    const parsedConnectorData = JSON.parse(existingConnectorData || "{}");
    setWalletConnectStorage(parsedConnectorData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>WCJS TEST APP</h1>
        {/* <div>Mock handshakeTopic: {mockConnector.handshakeTopic}</div>
        <div>
          Connector handshakeTopic: {connector?.handshakeTopic || "N/A"}
        </div>
        <button onClick={showStorageHandshakeTopic}>
          Get latest storage handshakeTopic
        </button>
        <div>
          Storage handshakeTopic:{" "}
          {walletconnectStorage?.handshakeTopic || "N/A"}
        </div> */}
        {connected ? (
          <div>
            <div>Connected!</div>
            <button onClick={handleConnect}>connect again (break me)</button>
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
          <div>
            <button onClick={handleConnect}>connect</button>
          </div>
        )}
        {/* <button onClick={addMockToStorage}>
          fill mock connector to storage
        </button> */}
      </header>
      <QRCodeModal walletConnectService={walletConnectService} />
    </div>
  );
}

export default App;
