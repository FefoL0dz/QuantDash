import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ProgressRingChart = ({ value = 75 }) => {
    // Data for the legend, matching the previous images
    const legendData = [
        { name: 'Até 10%', color: '#EDB8B8' },   // Pastel Red
        { name: '10% até 45%', color: '#FCE7A4' }, // Pastel Yellow
        { name: '45% ou mais', color: '#9CDD9D' }, // Pastel Green
    ];

    const progressColor = '#9CDD9D'; // The green color for the progress
    const trackColor = '#f3f4f6'; // Light gray for the background track

    // Determine text label based on value
    let labelText = 'Ótimo / Bom';
    if (value <= 10) labelText = 'Crítico';
    else if (value <= 45) labelText = 'Atenção';

    // Data for the progress pie
    // The first entry is the progress, the second is the remaining space (transparent)
    const progressData = [
        { name: 'progress', value: value },
        { name: 'remainder', value: 100 - value },
    ];

    // Data for the background track pie (a full circle)
    const trackData = [{ name: 'track', value: 100 }];

    return (
        <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Title */}
            <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '20px', textAlign: 'left' }}>
                Nível de aceitação
            </h3>

            {/* Chart Container */}
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Background Track Pie */}
                        <Pie
                            data={trackData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius="85%" // Creates the ring effect
                            outerRadius="95%"
                            startAngle={90} // Start from top
                            endAngle={-270} // Go full circle
                            fill={trackColor}
                            stroke="none"
                            isAnimationActive={false} // No animation for the track
                        />

                        {/* Progress Pie (rendered on top) */}
                        <Pie
                            data={progressData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius="85%"
                            outerRadius="95%"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                            cornerRadius={10} // Rounded corners for the progress bar
                        >
                            {/* Cell for the progress part */}
                            <Cell fill={progressColor} />
                            {/* Cell for the remainder part (transparent) */}
                            <Cell fill="transparent" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Centered Text */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', lineHeight: '1' }}>
                        {value}%
                    </div>
                    <div style={{ fontSize: '16px', color: '#666', marginTop: '5px' }}>
                        {labelText}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '20px',
                background: '#f9fafb',
                padding: '15px',
                borderRadius: '8px'
            }}>
                {legendData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '3px' }} />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressRingChart;
