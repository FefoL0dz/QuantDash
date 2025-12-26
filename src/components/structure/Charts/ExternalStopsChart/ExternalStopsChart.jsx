import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- Mock Data ---
// Expanded to demonstrate scrolling behavior
const data = [
    { name: 'CHUVA', hours: 42, pct: 90 },
    { name: 'DRAFT FINAL', hours: 38, pct: 80 },
    { name: 'AGUARDANDO', hours: 42, pct: 85 },
    { name: 'ULTIMO CABO', hours: 5, pct: 10 },
    { name: 'ATRACAÇÃO', hours: 28, pct: 55 },
    { name: 'DESCIDA', hours: 10, pct: 20 },
    { name: 'PRIMEIRO CABO', hours: 38, pct: 75 },
    { name: 'INSPEÇÃO', hours: 4, pct: 8 },
    { name: 'LIBERAÇÃO', hours: 12, pct: 25 },
    { name: 'ABASTECIMENTO', hours: 6, pct: 12 },
    { name: 'MANUTENÇÃO', hours: 24, pct: 50 },
    { name: 'LIMPEZA', hours: 8, pct: 16 },
    { name: 'DOCUMENTAÇÃO', hours: 2, pct: 4 },
    { name: 'TROCA DE TURNO', hours: 1, pct: 2 },
    { name: 'REUNIÃO', hours: 3, pct: 6 },
];

const ExternalStopsChart = () => {
    // Configuration constants
    const BAR_WIDTH_PIXELS = 120;
    const MIN_CHART_WIDTH = 800;
    const CHART_HEIGHT = 400;

    // Calculate dynamic width: Ensure it's at least the minimum, or wider if many items exist
    const dynamicWidth = Math.max(MIN_CHART_WIDTH, data.length * BAR_WIDTH_PIXELS);

    return (
        <div style={{
            width: '100%',
            background: 'var(--bg-color-secondary)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-family, sans-serif)'
        }}>
            <h3 style={{
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '16px',
                color: 'var(--text-color-primary)'
            }}>
                Paradas Externas
            </h3>

            {/* SCROLL WRAPPER */}
            <div style={{
                width: '100%',
                overflowX: 'auto',
                paddingBottom: '16px'
            }}>

                {/* CHART CONTAINER */}
                <div style={{ width: `${dynamicWidth}px`, height: `${CHART_HEIGHT}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                            barGap={0}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />

                            {/* X-AXIS with Custom Multiline Ticks */}
                            <XAxis
                                dataKey="name"
                                interval={0} // Forces every single label to render (no skipping)
                                tickLine={false}
                                axisLine={{ stroke: 'var(--text-color-secondary)' }}
                                tick={({ x, y, payload }) => {
                                    const item = data.find(d => d.name === payload.value);
                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            {/* Line 1: The Category Name */}
                                            <text
                                                x={0}
                                                y={0}
                                                dy={16}
                                                textAnchor="middle"
                                                fill="var(--text-color-primary)"
                                                fontSize={12}
                                                fontWeight={500}
                                            >
                                                {payload.value}
                                            </text>

                                            {/* Line 2: The Hours Value */}
                                            <text
                                                x={0}
                                                y={0}
                                                dy={34}
                                                textAnchor="middle"
                                                fill="var(--text-color-secondary)"
                                                fontSize={11}
                                            >
                                                {item?.hours} horas
                                            </text>
                                        </g>
                                    );
                                }}
                            />

                            {/* LEFT Y-AXIS (Hours) */}
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="var(--text-color-secondary)"
                                tick={{ fill: 'var(--text-color-secondary)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            {/* RIGHT Y-AXIS (Percentage) */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="var(--text-color-secondary)"
                                unit="%"
                                tick={{ fill: 'var(--text-color-secondary)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            {/* TOOLTIP Customization */}
                            <Tooltip
                                cursor={{ fill: 'var(--bg-color-primary)', opacity: 0.4 }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'var(--bg-color-secondary)',
                                    color: 'var(--text-color-primary)'
                                }}
                            />

                            {/* THE BARS */}
                            <Bar
                                yAxisId="left"
                                dataKey="hours"
                                fill="#b3b3e6" // Light purple color from screenshot - kept hardcoded or could use variable
                                radius={[4, 4, 0, 0]} // Rounded top corners
                                barSize={40}
                                activeBar={{ fill: '#9f9fd6' }} // Darker on hover
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Legend / Footer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-color-secondary)',
                marginTop: '8px',
                paddingLeft: '8px',
                paddingRight: '8px'
            }}>
                <span>Total de horas registradas</span>
                <span>Visualização completa</span>
            </div>
        </div>
    );
};

export default ExternalStopsChart;
