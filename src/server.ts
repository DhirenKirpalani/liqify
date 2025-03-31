import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import price from "./routes/prices";
import currencies from "./routes/currencies";
import cryptoData from "./routes/crypto-data";
import coinCategories from "./routes/coin-categories";
import coinData from "./routes/coin-data";
import coinDetails from "./routes/coin-details";
import coinDetailsHistory from "./routes/coin-details-history";
import liveCoinWatchOverview from "./routes/livecoinwatch-overview";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/prices", price);
app.use("/currencies", currencies);
app.use("/crypto-data", cryptoData);
app.use("/coin-categories", coinCategories);
app.use("/coin-data", coinData);
app.use("/coin-details", coinDetails);
app.use("/coin-details-history", coinDetailsHistory);
app.use("/livecoinwatch-overview", liveCoinWatchOverview);

app.get("/", (req: Request, res: Response) => {
  res.send("Alpha Pit PvP API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
