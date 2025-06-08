// import { useEffect, useState, useRef } from "react";

// interface MarketData {
//   symbol: string;
//   lastPrice?: number;
//   lastSize?: number;
//   bestBid?: number;
//   bestAsk?: number;
//   fundingRate?: number;
// }

// const ASSET_TO_MARKET_MAP: Record<string, string> = {
//   BTC: "BTC",
//   ETH: "ETH",
//   SOL: "SOL",
//   XRP: "XRP",
//   DOGE: "DOGE",
//   AVAX: "AVAX",
// };

// const TOP_5_MARKETS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "AVAX"];

// const WS_URL = "wss://api.hyperliquid.xyz/ws";

// const DEBUG = false;

// // Helper to safely parse numbers
// function safeParse(input: any): number | undefined {
//   const n = Number(input);
//   return Number.isFinite(n) ? n : undefined;
// }

// export function useHyperliquidMarketData() {
//   const [markets, setMarkets] = useState<Record<string, MarketData>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const ws = useRef<WebSocket | null>(null);

//   function updateMarketData(
//     symbol: string,
//     lastPrice?: number,
//     lastSize?: number,
//     otherData?: Partial<Omit<MarketData, "symbol" | "lastPrice" | "lastSize">>
//   ) {
//     setMarkets((prev) => {
//       const prevData = prev[symbol] || { symbol };
//       return {
//         ...prev,
//         [symbol]: {
//           ...prevData,
//           lastPrice: lastPrice ?? prevData.lastPrice,
//           lastSize: lastSize ?? prevData.lastSize,
//           ...otherData,
//         },
//       };
//     });
//   }

//   useEffect(() => {
//     ws.current = new WebSocket(WS_URL);

//     ws.current.onopen = () => {
//       if (DEBUG) console.log("🔌 [Hyperliquid] WS connected");

//       // Subscribe to trades and l2Book for top markets
//       TOP_5_MARKETS.forEach((asset) => {
//         const coin = asset; // BTC, ETH, etc.

//         // trades subscription
//         ws.current?.send(
//           JSON.stringify({
//             method: "subscribe",
//             subscription: { type: "trades", coin },
//           })
//         );

//         // l2Book subscription
//         ws.current?.send(
//           JSON.stringify({
//             method: "subscribe",
//             subscription: { type: "l2Book", coin },
//           })
//         );
//       });

//       // Subscribe to allMids
//       ws.current?.send(
//         JSON.stringify({
//           method: "subscribe",
//           subscription: { type: "allMids" },
//         })
//       );
//     };

//     ws.current.onerror = (event) => {
//       console.error("❌ [Hyperliquid] WS error:", event);
//       setError("WebSocket error");
//     };

//     ws.current.onclose = (event) => {
//       if (DEBUG) console.log("🔌 [Hyperliquid] WS closed:", event.reason);
//     };

//     // ws.current.onmessage = (event) => {
//     //   console.log("📊 [Hyperliquid] WS raw message:", event.data);

//     //   try {
//     //     const data = JSON.parse(event.data);

//     //     console.log("📊 [Hyperliquid] Parsed WS message:", data);

//     //     if (data.error) {
//     //       console.error("❌ [Hyperliquid] API Error:", data.error);
//     //       setError(`API error: ${data.error}`);
//     //       return;
//     //     }

//     //     const sub = data.subscription;
//     //     if (!sub || !data.data) return; // ignore non-data messages

//     //     // trades
//     //     if (sub.type === "trades") {
//     //       const symbol = ASSET_TO_MARKET_MAP[sub.coin];
//     //       const trades = data.data;
//     //       if (Array.isArray(trades) && trades.length > 0) {
//     //         const lastTrade = trades[trades.length - 1];
//     //         updateMarketData(
//     //           symbol,
//     //           safeParse(lastTrade.px),
//     //           safeParse(lastTrade.sz)
//     //         );
//     //       }
//     //     }
//     //     // l2Book → bestBid / bestAsk
//     //     else if (data.channel === "l2Book") {
//     //       const { coin, levels } = data.data;
//     //       const symbol = ASSET_TO_MARKET_MAP[coin];
//     //       if (levels && levels.length === 2) {
//     //         const bestBid = levels[0]?.[0]?.px || levels[0]?.[0]?.[0]; // depends on exact structure
//     //         const bestAsk = levels[1]?.[0]?.px || levels[1]?.[0]?.[0]; // depends on exact structure
        
//     //         updateMarketData(symbol, undefined, undefined, {
//     //           bestBid: safeParse(bestBid),
//     //           bestAsk: safeParse(bestAsk),
//     //         });
//     //       }
//     //     }
        
//     //     // allMids → fundingRate
//     //     else if (sub.type === "allMids") {
//     //       const mids = data.data;
//     //       if (typeof mids === "object" && mids !== null) {
//     //         Object.entries(mids).forEach(([coin, rate]) => {
//     //           const symbol = ASSET_TO_MARKET_MAP[coin];
//     //           if (!symbol) return;
//     //           updateMarketData(symbol, undefined, undefined, {
//     //             fundingRate: safeParse(rate),
//     //           });
//     //         });
//     //       }
//     //     }

//     //     setLoading(false);
//     //     setError(null);
//     //   } catch (err) {
//     //     console.error("❌ [Hyperliquid] Error parsing WS message:", err);
//     //     setError("Failed to process market data");
//     //   }
//     // };

//     ws.current.onmessage = (event) => {
//       if (DEBUG) console.log("📊 [Hyperliquid] WS raw message:", event.data);
    
//       try {
//         const data = JSON.parse(event.data);
    
//         if (DEBUG) console.log("📊 [Hyperliquid] Parsed WS message:", data);
    
//         if (data.error) {
//           console.error("❌ [Hyperliquid] API Error:", data.error);
//           setError(`API error: ${data.error}`);
//           setLoading(false);
//           return;
//         }
    
//         // New structure handling
//         if (data.channel === "trades") {
//           // trades data is an array of trade objects
//           const trades = data.data;
//           if (Array.isArray(trades) && trades.length > 0) {
//             // Use the coin of the first trade as symbol base
//             const coin = trades[0].coin;
//             const symbol = ASSET_TO_MARKET_MAP[coin];
//             // Get the last trade (latest)
//             const lastTrade = trades[trades.length - 1];
//             console.log(
//               `📈 Trade - Coin: ${coin}, Symbol: ${symbol}, Price: ${lastTrade.px}, Size: ${lastTrade.sz}`
//             );
//             updateMarketData(
//               symbol,
//               safeParse(lastTrade.px),
//               safeParse(lastTrade.sz)
//             );
//           }
//         } 
//         else if (data.channel === "l2Book") {
//           const { coin, levels } = data.data;
//           const symbol = ASSET_TO_MARKET_MAP[coin];
//           if (levels && levels.length === 2) {
//             const bestBid = levels[0]?.[0]?.px || levels[0]?.[0]?.[0]; // depends on exact structure
//             const bestAsk = levels[1]?.[0]?.px || levels[1]?.[0]?.[0]; // depends on exact structure

//             console.log(
//               `📚 L2Book - Coin: ${coin}, Symbol: ${symbol}, BestBid: ${bestBid}, BestAsk: ${bestAsk}`
//             );
        
//             updateMarketData(symbol, undefined, undefined, {
//               bestBid: safeParse(bestBid),
//               bestAsk: safeParse(bestAsk),
//             });
//           }
//         }
         
//         else if (data.channel === "allMids") {
//           const mids = data.data.mids;
//           if (mids && typeof mids === "object") {
//             Object.entries(mids).forEach(([midKey, fundingRateStr]) => {
//               const fundingRate = safeParse(fundingRateStr);
//               console.log(`Market: ${midKey}, fundingRate: ${fundingRate}`);
//               updateMarketData(midKey, undefined, undefined, { fundingRate });
//             });
//           }
//         }
        
    
//         setLoading(false);
//         setError(null);
//       } catch (err) {
//         console.error("❌ [Hyperliquid] Error parsing WS message:", err);
//         setError("Failed to process market data");
//         setLoading(false);
//       }
//     };
    

//     return () => {
//       ws.current?.close();
//     };
//   }, []);

//   const marketList = TOP_5_MARKETS.map((asset) => {
//     const symbol = ASSET_TO_MARKET_MAP[asset];
//     return markets[symbol ?? ""] ?? { symbol: symbol ?? asset };
//   });

//   return { marketData: marketList, error, loading };
// }

import { useEffect, useState, useRef } from "react";

interface MarketData {
  symbol: string;
  lastPrice?: number;
  lastSize?: number;
  bestBid?: number;
  bestAsk?: number;
  midPrice?: number; // <-- was fundingRate
}

const ASSET_TO_MARKET_MAP: Record<string, string> = {
  BTC: "BTC",
  ETH: "ETH",
  SOL: "SOL",
  XRP: "XRP",
  DOGE: "DOGE",
  AVAX: "AVAX",
};

const TOP_5_MARKETS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "AVAX"];

const WS_URL = "wss://api.hyperliquid.xyz/ws";

const DEBUG = false;

// Helper to safely parse numbers
function safeParse(input: any): number | undefined {
  const n = Number(input);
  return Number.isFinite(n) ? n : undefined;
}

// Helper to format numbers with commas for display
export function formatNumber(n?: number, fractionDigits = 2): string {
  if (n === undefined) return "-";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function useHyperliquidMarketData() {
  const [markets, setMarkets] = useState<Record<string, MarketData>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const ws = useRef<WebSocket | null>(null);

  function updateMarketData(
    symbol: string,
    lastPrice?: number,
    lastSize?: number,
    otherData?: Partial<Omit<MarketData, "symbol" | "lastPrice" | "lastSize">>
  ) {
    setMarkets((prev) => {
      const prevData = prev[symbol] || { symbol };
      return {
        ...prev,
        [symbol]: {
          ...prevData,
          lastPrice: lastPrice ?? prevData.lastPrice,
          lastSize: lastSize ?? prevData.lastSize,
          ...otherData,
        },
      };
    });
  }

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      if (DEBUG) console.log("🔌 [Hyperliquid] WS connected");

      // Subscribe to trades and l2Book for top markets
      TOP_5_MARKETS.forEach((asset) => {
        const coin = asset; // BTC, ETH, etc.

        // trades subscription
        ws.current?.send(
          JSON.stringify({
            method: "subscribe",
            subscription: { type: "trades", coin },
          })
        );

        // l2Book subscription
        ws.current?.send(
          JSON.stringify({
            method: "subscribe",
            subscription: { type: "l2Book", coin },
          })
        );
      });

      // Subscribe to allMids
      ws.current?.send(
        JSON.stringify({
          method: "subscribe",
          subscription: { type: "allMids" },
        })
      );
    };

    ws.current.onerror = (event) => {
      console.error("❌ [Hyperliquid] WS error:", event);
      setError("WebSocket error");
    };

    ws.current.onclose = (event) => {
      if (DEBUG) console.log("🔌 [Hyperliquid] WS closed:", event.reason);
    };

    ws.current.onmessage = (event) => {
      if (DEBUG) console.log("📊 [Hyperliquid] WS raw message:", event.data);

      try {
        const data = JSON.parse(event.data);

        if (DEBUG) console.log("📊 [Hyperliquid] Parsed WS message:", data);

        if (data.error) {
          console.error("❌ [Hyperliquid] API Error:", data.error);
          setError(`API error: ${data.error}`);
          setLoading(false);
          return;
        }

        // trades
        if (data.channel === "trades") {
          const trades = data.data;
          if (Array.isArray(trades) && trades.length > 0) {
            const coin = trades[0].coin;
            const symbol = ASSET_TO_MARKET_MAP[coin];
            const lastTrade = trades[trades.length - 1];
            console.log(
              `📈 Trade - Coin: ${coin}, Symbol: ${symbol}, Price: ${lastTrade.px}, Size: ${lastTrade.sz}`
            );
            updateMarketData(
              symbol,
              safeParse(lastTrade.px),
              safeParse(lastTrade.sz)
            );
          }
        }
        // l2Book → bestBid / bestAsk
        else if (data.channel === "l2Book") {
          const { coin, levels } = data.data;
          const symbol = ASSET_TO_MARKET_MAP[coin];
          if (levels && levels.length === 2) {
            const bestBid = levels[0]?.[0]?.px || levels[0]?.[0]?.[0];
            const bestAsk = levels[1]?.[0]?.px || levels[1]?.[0]?.[0];

            console.log(
              `📚 L2Book - Coin: ${coin}, Symbol: ${symbol}, BestBid: ${bestBid}, BestAsk: ${bestAsk}`
            );

            updateMarketData(symbol, undefined, undefined, {
              bestBid: safeParse(bestBid),
              bestAsk: safeParse(bestAsk),
            });
          }
        }
        // allMids → midPrice
        else if (data.channel === "allMids") {
          const mids = data.data.mids;
          if (mids && typeof mids === "object") {
            Object.entries(mids).forEach(([midKey, midPriceStr]) => {
              const midPrice = safeParse(midPriceStr);
              console.log(
                `📊 AllMids - Market: ${midKey}, midPrice: ${midPrice}`
              );
              // midKey is like "@1", "@2" — for now store it as is (no map to symbol yet)
              updateMarketData(midKey, undefined, undefined, { midPrice });
            });
          }
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("❌ [Hyperliquid] Error parsing WS message:", err);
        setError("Failed to process market data");
        setLoading(false);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const marketList = TOP_5_MARKETS.map((asset) => {
    const symbol = ASSET_TO_MARKET_MAP[asset];
    return markets[symbol ?? ""] ?? { symbol: symbol ?? asset };
  });

  return { marketData: marketList, error, loading };
}


