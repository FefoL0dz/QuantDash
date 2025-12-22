import React from 'react';
import LineBarAreaComposedChart from '@/components/structure/Charts/ComposedChart/LineBarAreaComposedChart';
import { enginePerformanceMock } from '@/mockData/enginePerformance';
import { useUI } from '@/context/UIContext';

/**
 * Demo page that showcases the LineBarAreaComposedChart with realistic mock data.
 *
 * The component is placed under `src/pages/Demo` so it can be imported into the
 * router or rendered directly from the app entry point for quick testing.
 */
const LineBarAreaDemo = ({
    data = enginePerformanceMock,
    title = 'Engine Performance – Demo',
    description = 'This chart combines multiple series types and automatically adopts the selected accent color.',
    xKey = 'month',
    lineKey = 'line',
    barKey = 'bar',
    areaKey = 'area',
    accentColor: accentColorProp,
    ...chartOverrides
}) => {
    const { accentColor: accentColorFromUI } = useUI();
    const accentColor = accentColorProp || accentColorFromUI;

    return (
        <section style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-color-primary)' }}>{title}</h2>
            <p style={{ color: 'var(--text-color-secondary)', lineHeight: 1.5 }}>
                {description}
                <span style={{ display: 'block', marginTop: '0.5rem' }}>
                    The <code>LineBarAreaComposedChart</code> below inherits the accent color so demos and dashboard widgets stay consistent.
                </span>
            </p>
            <LineBarAreaComposedChart
                data={data}
                xKey={xKey}
                lineKey={lineKey}
                barKey={barKey}
                areaKey={areaKey}
                accentColor={accentColor}
                {...chartOverrides}
            />
        </section>
    );
};

export default LineBarAreaDemo;
