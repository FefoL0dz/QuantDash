import React from "react";
import {
    ComposedChart,
    Line,
    Bar,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const DEFAULT_COLORS = {
    line: "#ff7300",
    bar: "#413ea0",
    area: "#8884d8",
};

const isHexColor = (color) => typeof color === "string" && /^#([0-9a-f]{3}){1,2}$/i.test(color);

const shiftColor = (color, percent) => {
    if (!isHexColor(color)) return color;
    let hex = color.replace("#", "");
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
    }

    const num = parseInt(hex, 16);
    const amount = Math.round((percent / 100) * 255);

    const clamp = (value) => Math.min(255, Math.max(0, value));
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00ff) + amount);
    const b = clamp((num & 0x0000ff) + amount);

    const toHex = (value) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * LineBarAreaComposedChart
 *
 * A reusable composed chart that combines a line, bar, and area series.
 * It is lightweight and can be expanded with additional series or custom
 * components without modifying the core structure.
 *
 * Props:
 *   - data: Array of objects representing the chart data. Each object should
 *           contain at least the keys used for the X axis and the three series
 *           (e.g., { name: "Jan", line: 4000, bar: 2400, area: 2400 }).
 *   - xKey:   String key for the X‑axis (default: "name").
 *   - lineKey, barKey, areaKey: String keys for the respective series.
 */
const LineBarAreaComposedChart = ({
    data = [],
    xKey = "name",
    lineKey = "line",
    barKey = "bar",
    areaKey = "area",
    accentColor,
    lineColor,
    barColor,
    areaColor,
    barSize = 20,
    areaFillOpacity = 0.25,
    showLegend = true,
}) => {
    const resolvedAccent = accentColor;
    const colors = {
        line: lineColor || resolvedAccent || DEFAULT_COLORS.line,
        bar:
            barColor ||
            (resolvedAccent ? shiftColor(resolvedAccent, -12) : DEFAULT_COLORS.bar),
        area:
            areaColor ||
            (resolvedAccent ? shiftColor(resolvedAccent, 18) : DEFAULT_COLORS.area),
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                {showLegend && <Legend />}
                {/* Area is rendered first so it appears behind the line and bar */}
                <Area
                    type="monotone"
                    dataKey={areaKey}
                    fill={colors.area}
                    stroke={colors.area}
                    fillOpacity={areaFillOpacity}
                />
                <Bar dataKey={barKey} barSize={barSize} fill={colors.bar} />
                <Line
                    type="monotone"
                    dataKey={lineKey}
                    stroke={colors.line}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default LineBarAreaComposedChart;
