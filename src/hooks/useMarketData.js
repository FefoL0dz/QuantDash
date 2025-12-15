import { useState, useEffect } from 'react';
import { useFilters } from '../context/FilterContext';
import { generateRandomWalk, calculateBollingerBands, calculateRSI } from '../services/math-utils';

export const useMarketData = () => {
    const { filters } = useFilters();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // We keep a "fresh" raw data set in memory so we don't regenerate randomness on every currency switch,
    // unless the *asset* or *timeframe* changes.
    // In a real app, this caching is handled by React Query.
    const [rawData, setRawData] = useState([]);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            // Simulate Network Delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const steps = filters.timeframe === '1D' ? 24 : 168; // 24 points vs 168
            const startPrice = filters.asset === 'BTC' ? 45000 : filters.asset === 'ETH' ? 3000 : 100;
            const volatility = filters.asset === 'BTC' ? 500 : 50;

            const newRawData = generateRandomWalk(startPrice, steps, volatility);
            setRawData(newRawData);
            setLoading(false);
        };

        fetchData();
    }, [filters.asset, filters.timeframe]); // Only re-fetch "API" if these change

    // This effect handles client-side transformations (Currency + Indicators)
    useEffect(() => {
        if (rawData.length === 0) return;

        // 1. Currency Conversion
        const multiplier = filters.currency === 'EUR' ? 0.85 : 1;
        const convertedData = rawData.map(d => ({
            ...d,
            price: parseFloat((d.originalPrice * multiplier).toFixed(2))
        }));

        // 2. Math Analysis
        const withBollinger = calculateBollingerBands(convertedData, 10);
        const finalData = calculateRSI(withBollinger, 14);

        setData(finalData);
    }, [rawData, filters.currency]); // Re-run if raw data changes OR currency changes

    return { data, loading, filters };
};
