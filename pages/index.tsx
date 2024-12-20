import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [isRich, setIsRich] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const checkBalance = async () => {
    setError("");
    setBalance(null);
    setIsRich(false);

    if (!/^[A-Za-z0-9]{32,44}$/.test(walletAddress)) {
      setError("Please enter a valid Solana wallet address.");
      return;
    }

    try {
      const response = await fetch(`/api/getbalance?address=${walletAddress}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Solana RPC.");
      }

      const data = await response.json();
      if (data && data.data && typeof data.data.sol === "number") {
        // Round to two decimal places
        const sol = Number(data.data.sol.toFixed(2));
        setBalance(sol);
        setIsRich(sol >= 100);
      } else {
        setError("Invalid wallet address or no balance found.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error fetching balance. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{isRich ? "I'm Rich" : "I'm Not Rich"}</h1>
      <div
        style={{
          margin: "20px auto",
          height: "200px",
          width: "200px",
          backgroundColor: isRich ? "red" : "gray",
          animation: isRich ? "flash 1s infinite" : "none",
        }}
      />
      <input
        type="text"
        placeholder="Enter Solana Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={checkBalance}
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        Check Balance
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {balance !== null && (
        isRich 
          ? <p>You have {balance} SOL. You are Rich!</p>
          : <p>You only have {balance} Solana. You are still a jeet.</p>
      )}

      <style>
        {`
          @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}