import React from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const BollingerChart = ({ data = [], title = 'Bollinger Bands', color = '#2563eb' }) => {
    return (
        <div style={{ width: '100%', height: 400, background: 'var(--bg-color-secondary)', borderRadius: '8px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-color-primary)' }}>{title}</h3>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 0,
                    }}
                >
                    <CartesianGrid stroke="var(--border-color)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12, fill: 'var(--text-color-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12, fill: 'var(--text-color-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            background: 'var(--bg-color-secondary)',
                            color: 'var(--text-color-primary)'
                        }}
                    />
                    <Legend />

                    {/* Upper Band Limit */}
                    <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill={color}
                        fillOpacity={0.1}
                    />

                    <Line type="monotone" dataKey="upper" stroke={color} strokeDasharray="3 3" dot={false} strokeWidth={1} strokeOpacity={0.5} />
                    <Line type="monotone" dataKey="lower" stroke={color} strokeDasharray="3 3" dot={false} strokeWidth={1} strokeOpacity={0.5} />

                    {/* The Actual Price Line */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />

                    {/* Moving Average */}
                    <Line
                        type="monotone"
                        dataKey="ma"
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        dot={false}
                    />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BollingerChart;
