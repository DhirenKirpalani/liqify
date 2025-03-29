import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const LIVE_COIN_WATCH_API = "https://api.livecoinwatch.com/overview";
const API_KEY = process.env.LIVE_COIN_WATCH_API_KEY;

router.post("/", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      LIVE_COIN_WATCH_API,
      { currency: "USD" },
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
