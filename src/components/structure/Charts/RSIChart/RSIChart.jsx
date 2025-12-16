import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

const RSIChart = ({ data = [], title = 'Relative Strength Index (RSI)', color = '#8b5cf6' }) => {
    return (
        <div style={{ width: '100%', height: 250, background: 'var(--bg-color-secondary)', borderRadius: '8px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-color-primary)', fontSize: '14px' }}>{title}</h3>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        bottom: 5,
                        left: 0,
                    }}
                >
                    <CartesianGrid stroke="var(--border-color)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: 'var(--text-color-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={[0, 100]}
                        ticks={[0, 30, 70, 100]}
                        tick={{ fontSize: 10, fill: 'var(--text-color-secondary)' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '4px',
                            border: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            background: 'var(--bg-color-secondary)',
                            color: 'var(--text-color-primary)'
                        }}
                    />

                    {/* Overbought / Oversold Zones */}
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '70', fill: '#ef4444', fontSize: 10 }} />
                    <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: '30', fill: '#22c55e', fontSize: 10 }} />

                    <Line
                        type="monotone"
                        dataKey="rsi"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RSIChart;
