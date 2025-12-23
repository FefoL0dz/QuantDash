import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const NaviosChart = ({ title = 'Navios' }) => {
    // Data approximated from the image visual positions
    const data = [
        { name: 'Janeiro', planejado: 380, executados: 265, speed: 44 },
        { name: 'Fevereiro', planejado: 380, executados: 350, speed: 64 },
        { name: 'Março', planejado: 380, executados: 310, speed: 52 },
        { name: 'Abril', planejado: 210, executados: 330, speed: 72 },
        { name: 'Maio', planejado: 375, executados: 240, speed: 66 },
    ];

    // Colors extracted from the image
    const colors = {
        blue: '#AEDCF5',   // Navios planejado
        orange: '#F7C697', // Navios executados
        green: '#A5DDA8',  // Navios planejados Speed
        text: 'var(--text-color-secondary)',
        grid: 'var(--border-color)',
        background: 'var(--bg-color-secondary)',
        title: 'var(--text-color-primary)'
    };

    // Custom Tick Renderer for the Right Axis
    const RightAxisTick = ({ x, y, payload }) => {
        let label = '';
        // Map the internal 0-400 scale to the label we want to see
        if (payload.value === 0) label = '0%';
        if (payload.value === 200) label = '40%';
        if (payload.value === 300) label = '60%';
        if (payload.value === 400) label = '100%';

        if (!label) return null;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={4} textAnchor="start" fill={colors.text} fontSize={12}>
                    {label}
                </text>
            </g>
        );
    };

    // Custom Legend to match the specific shapes
    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px', fontSize: '14px', color: colors.text }}>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Custom Icon drawing based on index */}
                        <svg width="14" height="14" viewBox="0 0 14 14" style={{ overflow: 'visible' }}>
                            {index === 0 && ( // Diamond for Blue
                                <rect x="2" y="2" width="10" height="10" fill={entry.color} transform="rotate(45 7 7)" />
                            )}
                            {index === 1 && ( // Circle for Orange
                                <circle cx="7" cy="7" r="5" fill={entry.color} />
                            )}
                            {index === 2 && ( // Triangle for Green
                                <polygon points="7,2 12,12 2,12" fill={entry.color} />
                            )}
                            {/* The Line stroke through the icon */}
                            <line x1="-4" y1="7" x2="18" y2="7" stroke={entry.color} strokeWidth="2" style={{ zIndex: -1 }} />
                        </svg>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{
            width: '100%',
            height: 400,
            background: colors.background,
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: colors.title, fontSize: '16px', fontWeight: 'bold' }}>
                    {title}
                </h3>
            </div>

            <div style={{ height: '330px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={colors.grid} />

                        {/* LEFT AXIS: 0 to 400 */}
                        <YAxis
                            yAxisId="left"
                            type="number"
                            domain={[0, 400]}
                            ticks={[0, 200, 300, 400]}
                            tick={{ fill: colors.text, fontSize: 12 }}
                            axisLine={{ stroke: colors.text }}
                            tickLine={{ stroke: colors.text }}
                        />

                        {/* RIGHT AXIS: Visual Trickery */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            type="number"
                            domain={[0, 400]}
                            ticks={[0, 200, 300, 400]}
                            tick={<RightAxisTick />}
                            axisLine={{ stroke: colors.text }}
                            tickLine={{ stroke: colors.text, width: 4 }}
                        />

                        <XAxis
                            dataKey="name"
                            tick={{ fill: colors.text, fontSize: 12, dy: 10 }}
                            axisLine={{ stroke: colors.text }}
                            tickLine={false}
                        />

                        <Legend content={<CustomLegend />} verticalAlign="top" height={36} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                background: 'var(--bg-color-primary)',
                                color: 'var(--text-color-primary)'
                            }}
                        />

                        {/* Series 1: Navios planejado (Blue Diamond) */}
                        <Line
                            yAxisId="left"
                            type="linear"
                            dataKey="planejado"
                            name="Navios planejado"
                            stroke={colors.blue}
                            strokeWidth={3}
                            dot={{ r: 5, fill: colors.blue, strokeWidth: 0, shape: "diamond" }}
                            activeDot={{ r: 7 }}
                        />

                        {/* Series 2: Navios executados (Orange Circle) */}
                        <Line
                            yAxisId="left"
                            type="linear"
                            dataKey="executados"
                            name="Navios executados"
                            stroke={colors.orange}
                            strokeWidth={3}
                            dot={{ r: 5, fill: colors.orange, strokeWidth: 0, shape: "circle" }}
                            activeDot={{ r: 7 }}
                        />

                        {/* Series 3: Speed (Green Triangle) */}
                        <Line
                            yAxisId="right"
                            type="linear"
                            dataKey={(row) => {
                                if (row.speed <= 40) return row.speed * 5;
                                return 200 + (row.speed - 40) * 5;
                            }}
                            name="Navios planejados Speed"
                            stroke={colors.green}
                            strokeWidth={3}
                            dot={{ r: 5, fill: colors.green, strokeWidth: 0, shape: "triangle" }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default NaviosChart;
