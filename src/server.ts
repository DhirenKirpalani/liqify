import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import liveCoinList from "./routes/live-coin-list";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/live-coin-list", liveCoinList);

app.get("/", (req: Request, res: Response) => {
  res.send("Alpha Pit PvP API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
