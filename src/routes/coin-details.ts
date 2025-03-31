import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const COINGECKO_API = process.env.COINGECKO_API_URL as string;
const API_KEY = process.env.COINGECKO_API_KEY as string;

router.get("/:id", async (req: Request, res: Response) => {
  const coinId = req.params.id; // Get the coin ID from the request parameters
  try {
    const response = await axios.get(
        `${COINGECKO_API}/coins/${coinId}`, // Use the coin ID in the API URL
      {
        headers: { 
          "x-api-key": API_KEY, 
          "Content-Type": "application/json" 
        }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({ 
      message: "Failed to fetch market overview",
      error: error.response?.data || "Unknown error"
    });
  }
});

export default router;
