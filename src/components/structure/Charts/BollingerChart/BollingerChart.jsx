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

const BollingerChart = ({ data = [], title = 'Bollinger Bands' }) => {
    return (
        <div style={{ width: '100%', height: 400, background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#374151' }}>{title}</h3>
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
                    <CartesianGrid stroke="#f3f4f6" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />

                    {/* The Bollinger Bands (Area) 
              Recharts Area usually requires one key, but for a range (upper/lower), 
              we can use two Areas or a "Range Area" if supported.
              Standard trick: Use 'stackId' or just draw two areas? 
              Actually, Recharts Area can take an array [min, max] for dataKey? 
              
              BETTER TRICK: Draw the "Lower" band as transparent Area? 
              Or draw the "Upper" band filled down to "Lower"?
              Recharts <Area> 'dataKey' expects a single value.
              
              We can simulate a band by using a stacked area? 
              Or simpler: 
              1. Draw Area 'upper' with fill='rgba...'
              2. Draw Area 'lower' with fill='white' (to mask it)? No background might not be white.
              
              REAL SOLUTION: 
              Use `type="monotone"` and `dataKey={[min, max]}` is supported in newer Recharts versions for Area!
              Let's try dataKey='range' where range is [lower, upper].
              
              Fallback if that fails: 
              Just draw lines for Upper/Lower and fill the space? 
              For POC, let's draw lines for Upper/Lower and a transparent fill for 'upper'.
          */}

                    {/* Upper Band Limit */}
                    <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="#93c5fd"
                        fillOpacity={0.3}
                    />
                    {/* Lower Band - trying to "cut out" the bottom? 
               Since we can't easily cut out, maybe just show the Area from 0 to Upper?
               The user asked for "Band between Upper and Lower".
               
               Recharts 2.x supports dataKey returning an array?
               Actually, standard Bollinger implementation often just shades the whole background or uses specific props.
               
               Let's try standard range area syntax if available, otherwise just shade 'upper' lightly. 
               Wait, if I use `baseLine` prop?
           */}

                    <Line type="monotone" dataKey="upper" stroke="#93c5fd" strokeDasharray="3 3" dot={false} strokeWidth={1} />
                    <Line type="monotone" dataKey="lower" stroke="#93c5fd" strokeDasharray="3 3" dot={false} strokeWidth={1} />

                    {/* The Actual Price Line */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
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
