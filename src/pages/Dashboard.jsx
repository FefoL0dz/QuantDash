import React, { useState } from 'react';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import LineBarAreaDemo from '../pages/Demo/LineBarAreaDemo';
import LayoutEditor from '../components/layout/LayoutEditor';
import { useMarketData } from '../hooks/useMarketData';
import { useFilters } from '../context/FilterContext';
import { useUI } from '../context/UIContext';
import UIConfigPanel from '../components/layout/UIConfigPanel';

// Simple UI for Global Controls
const DashboardControls = () => {
    const { filters, updateFilter } = useFilters();
    const { accentColor } = useUI();

    const selectStyle = {
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-color-primary)',
        color: 'var(--text-color-primary)'
    };

    return (
        <div style={{
            padding: '20px',
            background: 'var(--bg-color-secondary)',
            marginBottom: '20px',
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color)'
        }}>
            {/* Currency Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: 'var(--text-color-secondary)' }}>Currency:</label>
                <select
                    value={filters.currency}
                    onChange={(e) => updateFilter('currency', e.target.value)}
                    style={selectStyle}
                >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                </select>
            </div>

            {/* Asset Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: 'var(--text-color-secondary)' }}>Asset:</label>
                <select
                    value={filters.asset}
                    onChange={(e) => updateFilter('asset', e.target.value)}
                    style={selectStyle}
                >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                </select>
            </div>

            {/* Timeframe Toggle */}
            <div>
                <label style={{ fontWeight: '600', marginRight: '10px', color: 'var(--text-color-secondary)' }}>Timeframe:</label>
                <div style={{ display: 'inline-flex', gap: '5px' }}>
                    <button
                        onClick={() => updateFilter('timeframe', '1D')}
                        style={{
                            background: filters.timeframe === '1D' ? accentColor : 'var(--bg-color-primary)',
                            color: filters.timeframe === '1D' ? '#fff' : 'var(--text-color-secondary)',
                            padding: '6px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        1 Day
                    </button>
                    <button
                        onClick={() => updateFilter('timeframe', '1W')}
                        style={{
                            background: filters.timeframe === '1W' ? accentColor : 'var(--bg-color-primary)',
                            color: filters.timeframe === '1W' ? '#fff' : 'var(--text-color-secondary)',
                            padding: '6px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer',
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
    const { accentColor } = useUI();

    // 2. Layout State (Default Order)
    const [widgetOrder, setWidgetOrder] = useState([
        'sentiment_gauge',
        'bollinger_band',
        'rsi_chart',
        'progress_ring',
        'line_bar_area_demo',
        'navios_chart'
    ]);

    const [isConfigOpen, setIsConfigOpen] = useState(false);

    return (
        <div style={{ padding: '40px', background: 'var(--bg-color-primary)', minHeight: '100vh', transition: 'background-color 0.3s' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, color: 'var(--text-color-primary)', fontSize: '28px' }}>QuantDash Command Center</h1>
                    <p style={{ margin: '5px 0 0', color: 'var(--text-color-secondary)' }}>Algorithmic Trading & Analytics Dashboard</p>
                </div>
                <button
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    style={{
                        background: isConfigOpen ? 'var(--text-color-secondary)' : accentColor,
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.2s'
                    }}
                >
                    {isConfigOpen ? 'Close Settings' : 'Customize Board'}
                </button>
            </div>

            {/* Global Filters */}
            <DashboardControls />

            <div style={{ display: 'grid', gridTemplateColumns: isConfigOpen ? '3fr 1fr' : '1fr', gap: '20px', transition: 'grid-template-columns 0.3s ease' }}>

                {/* LEFT COLUMN: THE CHARTS */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-color-secondary)' }}>Loading Market Data...</div>
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
                            if (widgetId === 'bollinger_band' || widgetId === 'rsi_chart') {
                                dynamicProps = {
                                    data: data,
                                    title: widgetId === 'rsi_chart' ? 'Relative Strength Index' : `Volatility Analysis (${filters.asset}/${filters.currency})`,
                                    color: accentColor // Pass the dynamic color
                                };
                            }
                            if (widgetId === 'sentiment_gauge') {
                                // Simulate dynamic sentiment based on current random price trend?
                                // Let's just mock it based on asset type for variety
                                const mockVal = filters.asset === 'BTC' ? 72 : 45;
                                dynamicProps = {
                                    value: mockVal,
                                    title: `Market Sentiment (${filters.asset})`,
                                    color: accentColor // Pass the dynamic color
                                };
                            }
                            if (widgetId === 'line_bar_area_demo') {
                                dynamicProps = {
                                    accentColor,
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
                                    <div style={{
                                        background: 'var(--bg-color-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        height: '100%'
                                    }}>
                                        <WidgetComponent {...config.defaultProps} {...dynamicProps} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* RIGHT COLUMN: THE EDITOR & CONFIG */}
                {isConfigOpen && (
                    <div style={{ height: 'fit-content', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* 1. Appearance Settings */}
                        <UIConfigPanel />

                        {/* 2. Layout Ordering */}
                        <div style={{ background: 'var(--bg-color-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', letterSpacing: '0.05em' }}>
                                Widget Order
                            </h4>
                            <LayoutEditor
                                items={widgetOrder}
                                onReorder={setWidgetOrder}
                            />
                            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-color-secondary)' }}>
                                Drag to reorder widgets.
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
