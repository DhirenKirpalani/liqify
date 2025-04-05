// priceCache.ts

let previousPrice: number | null = null; // Cache for the previous price

// Function to calculate percentage change
// export const calculatePercentageChange = (currentPrice: number): number | null => {
//   if (previousPrice === null) {
//     previousPrice = currentPrice; // Initialize cache with the first price
//     return null; // No percentage change for the first price update
//   }

//   const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
//   previousPrice = currentPrice; // Update the cache with the current price
//   return percentageChange;
// };

// price-cache.ts

export function calculatePercentageChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) {
    return 0; // Avoid division by zero
  }
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}


export const getPreviousPrice = (): number | null => {
  return previousPrice; // Return cached previous price
};
