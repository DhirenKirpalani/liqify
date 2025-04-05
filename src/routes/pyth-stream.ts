import { Router, Request, Response } from "express";
import { HermesClient } from "@pythnetwork/hermes-client";

const router = Router();
const connection = new HermesClient("https://hermes.pyth.network", {});

router.post("/", async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ message: "Please provide an array of price IDs." });
    return;
  }

  try {
    const eventSource = await connection.getPriceUpdatesStream(ids);

    const updates: any[] = [];
    const maxUpdates = 3; // Limit to 3 for quicker Postman response

    // Timeout to avoid hanging requests
    const timeout = setTimeout(() => {
      console.error("Stream timeout");
      eventSource.close();
      if (!res.headersSent) {
        res.status(504).json({ message: "Stream timeout", updates });
      }
    }, 10000); // 10s

    // Handle incoming price updates
    eventSource.onmessage = (event) => {
      try {
        console.log("Received update:", event.data);
        const data = JSON.parse(event.data);
        updates.push(data);

        if (updates.length >= maxUpdates) {
          clearTimeout(timeout);
          eventSource.close();
          res.json({ updates });
        }
      } catch (parseErr) {
        console.error("Failed to parse update:", parseErr);
      }
    };

    // Handle errors
    eventSource.onerror = (error: any) => {
      console.error("Streaming error:", error);
      clearTimeout(timeout);
      eventSource.close();
      if (!res.headersSent) {
        res.status(500).json({
          message: "Streaming error",
          error: error?.message || "Unknown error",
        });
      }
    };
  } catch (err: unknown) {
    console.error("Hermes connection error:", err);
    res.status(500).json({
      message: "Failed to connect to Hermes",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
