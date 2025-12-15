// Helper to generate a Random Walk (Brownian Motion)
export const generateRandomWalk = (startPrice = 100, steps = 50, volatility = 2) => {
    const data = [];
    let currentPrice = startPrice;

    for (let i = 0; i < steps; i++) {
        // Generate a formatted time label (e.g., "10:00", "10:05")
        const date = new Date();
        date.setMinutes(date.getMinutes() - (steps - i) * 5); // 5 min interval
        const timeLabel = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

        // Random change
        const change = (Math.random() - 0.5) * volatility;
        currentPrice += change;

        // Ensure positive price
        if (currentPrice < 0.1) currentPrice = 0.1;

        data.push({
            time: timeLabel,
            price: parseFloat(currentPrice.toFixed(2)),
            originalPrice: parseFloat(currentPrice.toFixed(2)) // Keep track for currency conversion later
        });
    }
    return data;
};

// Helper to calculate Simple Moving Average (SMA) and Standard Deviation
export const calculateBollingerBands = (data, windowSize = 5) => {
    return data.map((entry, index) => {
        if (index < windowSize - 1) {
            return { ...entry, ma: null, upper: null, lower: null };
        }

        const slice = data.slice(index - windowSize + 1, index + 1);
        const prices = slice.map(d => d.price);

        // Calculate SMA
        const sum = prices.reduce((a, b) => a + b, 0);
        const ma = sum / windowSize;

        // Calculate StdDev
        const squareDiffs = prices.map(p => Math.pow(p - ma, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / windowSize;
        const stdDev = Math.sqrt(avgSquareDiff);

        return {
            ...entry,
            ma: parseFloat(ma.toFixed(2)),
            upper: parseFloat((ma + 2 * stdDev).toFixed(2)),
            lower: parseFloat((ma - 2 * stdDev).toFixed(2))
        };
    });
};

// Helper to calculate Relative Strength Index (RSI)
// Formula: RSI = 100 - (100 / (1 + RS))
// RS = Average Gain / Average Loss
export const calculateRSI = (data, period = 14) => {
    let gains = 0;
    let losses = 0;

    // 1. Calculate initial Average Gain/Loss (Simple Average)
    // We need at least 'period' data points before we can calculate the first RSI
    for (let i = 1; i <= period; i++) {
        if (!data[i]) return data; // Not enough data
        const change = data[i].price - data[i - 1].price;
        if (change > 0) gains += change;
        else losses += Math.abs(change);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    return data.map((entry, index) => {
        // RSI not available for the first 'period' points
        if (index < period) return { ...entry, rsi: null };

        // For subsequent points, use the Smoothed Moving Average method (Wilder's Smoothing)
        // However, for simplicity and since we recalculate the whole array roughly, 
        // we can iterate from the start. 
        // But map() doesn't carry state easily without closure.
        // Let's implement a stateful loop instead of map or use a simple loop.

        // RE-IMPLEMENTATION: It's better to loop once rather than use map for this dependent logic.
        return entry;
    }).map((entry, index, arr) => {
        if (index < period) return { ...entry, rsi: null };

        const currentChange = entry.price - arr[index - 1].price;
        let currentGain = currentChange > 0 ? currentChange : 0;
        let currentLoss = currentChange < 0 ? Math.abs(currentChange) : 0;

        // Wilder's Smoothing
        avgGain = ((avgGain * (period - 1)) + currentGain) / period;
        avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return { ...entry, rsi: parseFloat(rsi.toFixed(2)) };
    });
};

