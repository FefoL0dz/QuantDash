import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

// Needle Component
// We pass 'currentValue' to calculate rotation independently of the Pie slice data
const Needle = ({ cx, cy, outerRadius, currentValue, color }) => {
  // Guard against initial render where Recharts might pass 0 coordinates
  if (!cx || !cy) return null;

  const totalAngle = 180; // The gauge is a semi-circle
  const angle = 180 - (currentValue / 100) * totalAngle;

  const length = outerRadius * 0.8; // Needle length relative to chart radius

  // Calculate tip coordinates
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  const x2 = cx + length * cos;
  const y2 = cy + length * sin;

  return (
    <g>
      {/* Pivot Circle */}
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="none" />
      {/* Needle Line */}
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
};

const GaugeChart = ({ value = 72 }) => {
  const data = [
    { name: 'Até 10%', value: 10, color: '#EDB8B8' },   // Pastel Red
    { name: '10% até 45%', value: 35, color: '#FCE7A4' }, // Pastel Yellow
    { name: '45% ou mais', value: 55, color: '#9CDD9D' }, // Pastel Green
  ];

  const needleColor = '#333333';

  // Text label logic
  let labelText = 'Bom / Aceitável';
  if (value <= 10) labelText = 'Crítico';
  else if (value <= 45) labelText = 'Atenção';

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '0', textAlign: 'center' }}>
        Nível de qualidade do planejamento
      </h3>

      {/* Chart Container */}
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* The Gauge Arc */}
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="70%" // Moved up to leave space for text below
              innerRadius="60%"
              outerRadius="90%"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* The Needle Layer */}
            {/* We use a dummy data slice just to trigger the custom label component */}
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={[{ value: 1 }]}
              cx="50%"
              cy="70%" // Must match the Gauge Arc cy
              innerRadius="0%"
              outerRadius="90%"
              fill="none"
              stroke="none"
              labelLine={false}
              label={({ cx, cy, outerRadius }) => (
                <Needle
                  cx={cx}
                  cy={cy}
                  outerRadius={outerRadius}
                  currentValue={value} // Pass the actual prop value here
                  color={needleColor}
                />
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Value Text */}
        {/* Positioned absolutely relative to the container, below the pivot */}
        <div style={{
          position: 'absolute',
          top: '70%', // Matches the cy value
          left: '0',
          width: '100%',
          textAlign: 'center',
          marginTop: '15px' // Space between pivot and text
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', lineHeight: '1' }}>
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
        marginTop: '10px',
        background: '#f9fafb',
        padding: '10px',
        borderRadius: '8px'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '3px' }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaugeChart;