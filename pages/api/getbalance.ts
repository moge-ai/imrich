import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  // Validate the address query parameter
  if (typeof address !== "string" || !/^[A-Za-z0-9]{32,44}$/.test(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  try {
    // Connect to the mainnet-beta Solana RPC endpoint
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const publicKey = new PublicKey(address);

    // Fetch the balance in lamports
    const lamports = await connection.getBalance(publicKey);
    const sol = lamports / 1e9; // Convert lamports to SOL

    // Return the balance data as JSON
    return res.status(200).json({
      data: {
        lamports: lamports,
        sol: sol
      }
    });
  } catch (error) {
    console.error("Server error fetching balance:", error);
    return res.status(500).json({ error: "Server error fetching balance." });
  }
}