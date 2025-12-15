import React, { useState } from 'react';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import LayoutEditor from '../components/layout/LayoutEditor';
import { useMarketData } from '../hooks/useMarketData';
import { useFilters } from '../context/FilterContext';

// Simple UI for Global Controls
const DashboardControls = () => {
    const { filters, updateFilter } = useFilters();

    return (
        <div style={{
            padding: '20px',
            background: 'white',
            marginBottom: '20px',
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            {/* Currency Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: '#4b5563' }}>Currency:</label>
                <select
                    value={filters.currency}
                    onChange={(e) => updateFilter('currency', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                </select>
            </div>

            {/* Asset Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: '#4b5563' }}>Asset:</label>
                <select
                    value={filters.asset}
                    onChange={(e) => updateFilter('asset', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                </select>
            </div>

            {/* Timeframe Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: '#4b5563' }}>Timeframe:</label>
                <div style={{ display: 'inline-flex', gap: '5px' }}>
                    <button
                        onClick={() => updateFilter('timeframe', '1D')}
                        style={{
                            background: filters.timeframe === '1D' ? '#2563eb' : '#f3f4f6',
                            color: filters.timeframe === '1D' ? 'white' : '#4b5563',
                            padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        1 Day
                    </button>
                    <button
                        onClick={() => updateFilter('timeframe', '1W')}
                        style={{
                            background: filters.timeframe === '1W' ? '#2563eb' : '#f3f4f6',
                            color: filters.timeframe === '1W' ? 'white' : '#4b5563',
                            padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        1 Week
                    </button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    // 1. Data Logic
    const { data, loading, filters } = useMarketData();

    // 2. Layout State (Default Order)
    const [widgetOrder, setWidgetOrder] = useState([
        'sentiment_gauge',
        'bollinger_band',
        'rsi_chart'
    ]);

    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <div style={{ padding: '40px', background: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#111827', fontSize: '28px' }}>QuantDash Command Center</h1>
                    <p style={{ margin: '5px 0 0', color: '#6b7280' }}>Algorithmic Trading & Analytics Dashboard</p>
                </div>
                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    style={{
                        background: isEditMode ? '#ef4444' : '#1f2937',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.2s'
                    }}
                >
                    {isEditMode ? 'Close Editor' : 'Customize Layout'}
                </button>
            </div>

            {/* Global Filters */}
            <DashboardControls />

            <div style={{ display: 'grid', gridTemplateColumns: isEditMode ? '3fr 1fr' : '1fr', gap: '20px', transition: 'grid-template-columns 0.3s ease' }}>

                {/* LEFT COLUMN: THE CHARTS */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading Market Data...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', alignContent: 'start' }}>
                        {widgetOrder.map((widgetId) => {
                            const config = WIDGET_REGISTRY[widgetId];
                            if (!config) return null; // Graceful fallback if ID not found

                            const WidgetComponent = config.component;

                            // Inject props dynamically
                            let dynamicProps = {};

                            // Specific logic per widget type
                            // In a real generic system, we might pass the entire 'data' object and let widgets pick what they need
                            // OR map data streams in the registry.
                            if (widgetId === 'bollinger_band') {
                                dynamicProps = {
                                    data: data,
                                    title: `Volatility Analysis (${filters.asset}/${filters.currency})`
                                };
                            }
                            if (widgetId === 'sentiment_gauge') {
                                // Simulate dynamic sentiment based on current random price trend?
                                // Let's just mock it based on asset type for variety
                                const mockVal = filters.asset === 'BTC' ? 72 : 45;
                                dynamicProps = {
                                    value: mockVal,
                                    title: `Market Sentiment (${filters.asset})`
                                };
                            }

                            return (
                                <div
                                    key={widgetId}
                                    style={{
                                        // Spanning logic: Bollinger charts usually look better wide.
                                        gridColumn: widgetId === 'bollinger_band' ? '1 / -1' : 'auto',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <WidgetComponent {...config.defaultProps} {...dynamicProps} />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* RIGHT COLUMN: THE EDITOR */}
                {isEditMode && (
                    <div style={{ height: 'fit-content', position: 'sticky', top: '20px' }}>
                        <LayoutEditor
                            items={widgetOrder}
                            onReorder={setWidgetOrder}
                        />
                        <div style={{ marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px', color: '#1e40af', fontSize: '14px' }}>
                            <strong>Tip:</strong> Drag items to reorder. The dashboard updates instantly.
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
