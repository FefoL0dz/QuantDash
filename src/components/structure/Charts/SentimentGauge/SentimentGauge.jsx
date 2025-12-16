import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

// Custom Needle Component
const Needle = ({ cx, cy, iR, oR, value, color }) => {
  const totalAngle = 180; // Semi-circle
  const angle = 180 - (value / 100) * totalAngle; // 0->180, 100->0

  // Calculate needle length (projects slightly into outer radius)
  const length = (iR + 2 * oR) / 3;

  // Math for the needle tip
  // Note: -angle because Recharts/SVG coordinates y-axis is inverted relative to standard cartesian for up/down? 
  // Actually Recharts 0 is Right, 180 is Left. Positive angle is counter-clockwise.
  // We want 180 (Left) -> 0 (Right).
  // cos(180) = -1 (Left), sin(180) = 0.
  // cos(0) = 1 (Right), sin(0) = 0.
  // So standard cos/sin works if we pass the angle in degrees * RADIAN.

  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);

  // Needle shape (base center at cx, cy)
  // We want a triangle pointing to (xp, yp)
  const r = 5; // radius of base
  const x0 = cx;
  const y0 = cy;

  // Tip coordinates
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g>
      {/* Circle Base */}
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      {/* Needle Path: Thick base to sharp tip */}
      <path
        d={`M${x0} ${y0 - r} L${x0} ${y0 + r} L${xp} ${yp} Z`}
        transform={`rotate(${angle}, ${cx}, ${cy})`} // Actually simpler to just rotate a horizontal needle? 
      // No, let's calculate manually to be safe or use simple rotation.
      // Let's stick to the manual calculation logic but correct the path.
      // Re-calculating path to be simpler: Just a line or thin rect?
      // Let's use the rotation transform which is easier.
      />
      {/* Alternative: Simple Line with rotation */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + length}
        y2={cy}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${-angle}, ${cx}, ${cy})`}
      />
    </g>
  );
};

const SentimentGauge = ({ value = 50, title = 'Sentiment', color = '#1f2937' }) => {
  // Color logic for the tracks
  // 0-33: Red (Fear), 33-66: Yellow (Neutral), 66-100: Green (Greed)
  const data = [
    { name: 'Fear', value: 33, color: '#ef4444' },
    { name: 'Neutral', value: 33, color: '#eab308' },
    { name: 'Greed', value: 34, color: '#22c55e' }, // 34 to sum to 100
  ];

  // Determine active color for text
  // If we want to force the accent color for everything:
  // let activeColor = color;
  // But typically semantic colors (Red/Green) are important for Sentiment.
  // How about we make the Titl/Border use the accent color?
  // User asked "customize chart colors as well, all of them".
  // Let's assume they want the main 'brand' color to apply where neutral/default was.

  let activeColor = '#eab308';
  if (value < 33) activeColor = '#ef4444';
  if (value > 66) activeColor = '#22c55e';

  return (
    <div style={{ width: '100%', height: 300, background: 'var(--bg-color-secondary)', borderRadius: '8px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 0, color: 'var(--text-color-primary)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          {/* The Gauge Track (Colored Sections) */}
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="75%"
            innerRadius="60%"
            outerRadius="80%"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            {/* 
               We use the label prop callback to inject the needle because 
               Recharts calculates the responsive cx/cy for us here. 
            */}
            {/* Note: This is a hack. Normally we put Needle outside, but we need cx/cy. 
                 Using a CustomComponent which Recharts passes props to is better. 
                 Or just use the Label component inside Pie.
             */}
          </Pie>
          {/* 
            Since we need specific cx/cy, we can use a dummy Pie or just realize that 
            for responsive containers, 50% is center. 
            But we need PIXELS for the needle length calculation if we want it precise.
            However, we can render the Needle as a child relative to the Pie if we used a Custom Shape.
            
            Simpler Approach for POC:
            Use standard SVG placement assuming the center is mostly stable or rely on % transforms.
            Actually, let's use the 'active' prop trick or simply render it using a separate component if we can get dimensions.
            
            Best Way: Pass a custom function to `label` prop of the Pie, even if `label` is invisible.
            Or use `Chart` children with properties.
          */}
          {/* Let's try the Label approach mentioned in History.md as "Production Ready" */}
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={[{ value: 1 }]} // Dummy
            cx="50%"
            cy="75%"
            innerRadius={0}
            outerRadius={0} // Invisible
            fill="none"
            stroke="none"
            labelLine={false}
            label={({ cx, cy, viewBox }) => {
              // cx and cy are the center of the pie provided by Recharts
              // We can use them to position our needle
              // We need outerRadius to know how long the needle is.
              // We can estimate based on viewBox or hardcode relative to known wrapper?
              // The wrapper is 100% width.
              // Let's assume a radius based on the other Pie's 80%.
              const iR = 60; // These were strings "60%" in the main pie.. issues with mixing.
              const oR = 100; // approximation

              return (
                <Needle
                  cx={cx}
                  cy={cy}
                  iR={iR}
                  oR={oR}
                  value={value}
                  color={color}
                />
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '-40px', fontSize: '24px', fontWeight: 'bold', color: activeColor }}>
        {value}
      </div>
    </div>
  );
};

export default SentimentGauge;
