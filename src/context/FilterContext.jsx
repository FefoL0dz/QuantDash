import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const FilterContext = createContext();

// 2. The Provider Component
export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        currency: 'USD',    // 'USD' or 'EUR'
        timeframe: '1D',    // '1D', '1W', '1M'
        asset: 'BTC'        // 'BTC', 'ETH', 'SOL'
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

// 3. The Hook
export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
