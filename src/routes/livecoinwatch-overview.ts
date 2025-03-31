import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const LIVECOINWATCH_API = `https://api.livecoinwatch.com/coins/list` as string;
const API_KEY = process.env.LIVECOINWATCH_API_KEY as string;

router.post("/", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      LIVECOINWATCH_API,
      {
          currency: "USD",
          sort: "rank",
          order: "ascending",
          offset: 0,
          limit: 10,
          meta: true,
      },
      {
        headers: { 
          "x-api-key": API_KEY, 
          "Content-Type": "application/json" 
        }
      }
    );
    console.log(response.data);

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
