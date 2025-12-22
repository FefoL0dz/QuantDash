# Recharts Library Guide

Recharts is a Redefined chart library built with React and D3. It follows a declarative approach, making it easy to build complex charts by composing reusable components.

## Overview of Chart Types

This guide covers the various chart types available in Recharts 3.x, their purposes, and when to use them.

---

### 1. LineChart
**Purpose:** Visualize continuous data trends over time or categories.
- **Key Components:** `<Line />`, `<XAxis />`, `<YAxis />`, `<CartesianGrid />`, `<Tooltip />`.
- **Best Use Cases:** Stock prices, temperature changes, or any time-series data where the focus is on the rate of change.
- **Data Structure:** Array of objects with numeric values for the Y-axis and strings/dates for the X-axis.

### 2. BarChart
**Purpose:** Compare discrete categories of data.
- **Key Components:** `<Bar />`, `<XAxis />`, `<YAxis />`, `<Cell />`.
- **Best Use Cases:** Sales by region, population by city, or any comparison between distinct groups.
- **Data Structure:** Array of objects where each object represents a category.

### 3. AreaChart
**Purpose:** Emphasize the volume or magnitude of trends over time.
- **Key Components:** `<Area />`, `<XAxis />`, `<YAxis />`.
- **Best Use Cases:** Cumulative revenue, network bandwidth usage, or stacked trends showing contributions to a total.
- **Data Structure:** Similar to LineChart, but often used with multiple `<Area />` components for stacking.

### 4. ComposedChart
**Purpose:** Combine multiple chart types (Line, Bar, Area) in a single visualization.
- **Key Components:** `<Bar />`, `<Line />`, `<Area />` mixed within one `<ComposedChart />`.
- **Best Use Cases:** Showing actual vs. target (Bar + Line), or price trends with volume (Line + Bar).
- **Data Structure:** Unified array where each object contains properties for all visual elements.

### 5. PieChart
**Purpose:** Show proportions and parts-of-a-whole relationships.
- **Key Components:** `<Pie />`, `<Cell />`, `<Legend />`.
- **Best Use Cases:** Market share, budget allocation, or survey results.
- **Data Structure:** A simple array of objects with `name` and `value` properties.

### 6. RadarChart
**Purpose:** Display multivariate data across several axes (spider chart).
- **Key Components:** `<Radar />`, `<PolarGrid />`, `<PolarAngleAxis />`, `<PolarRadiusAxis />`.
- **Best Use Cases:** Skill assessment (e.g., player stats in gaming), comparing products across multiple features.
- **Data Structure:** Each object in the array represents a "spike" in the radar.

### 7. RadialBarChart
**Purpose:** A variation of the Bar Chart where bars are plotted on a polar coordinate system.
- **Key Components:** `<RadialBar />`, `<PolarAngleAxis />`.
- **Best Use Cases:** Progress indicators, comparing values in a circular format.
- **Data Structure:** Similar to BarChart, with values mapped to the radius or angle.

### 8. ScatterChart
**Purpose:** Show the relationship between two numeric variables.
- **Key Components:** `<Scatter />`, `<ZAxis />` (for bubble charts).
- **Best Use Cases:** Scientific data analysis, correlation between height and weight, or identifying outliers.
- **Data Structure:** Array of objects with `x`, `y`, and optionally `z` coordinates.

### 9. Treemap
**Purpose:** Display hierarchical data as a set of nested rectangles.
- **Key Components:** `<Treemap />`.
- **Best Use Cases:** Disk space usage, organizational structures, or nested category performance.
- **Data Structure:** Nested object structure representing branches and leaves.

### 10. FunnelChart
**Purpose:** Visualize stages in a process and the conversion rate between them.
- **Key Components:** `<Funnel />`, `<Trapezoid />`.
- **Best Use Cases:** Sales pipelines, website checkout flows, or recruitment processes.
- **Data Structure:** Array of objects representing each stage.

### 11. SankeyChart
**Purpose:** Visualize the flow of data between different states or categories.
- **Key Components:** `<Sankey />`.
- **Best Use Cases:** Energy consumption paths, cost allocation flows, or user journey through a website.
- **Data Structure:** Nodes and links (source, target, value).

### 12. SunburstChart
**Purpose:** Represent hierarchical data in a circular layout.
- **Key Components:** `<Sunburst />`.
- **Best Use Cases:** Multi-level categorical data, file system breakdown.
- **Data Structure:** Similar to Treemap but rendered radially.

---

## Technical Tips

- **ResponsiveContainer:** Always wrap your charts in `<ResponsiveContainer />` to ensure they adapt to parent dimensions.
- **Tooltip Customization:** Use the `content` prop in `<Tooltip />` to render a custom React component for better branding.
- **Animation:** Recharts includes built-in animations. You can toggle them using `isAnimationActive` or customize them with `animationDuration`.
- **Custom Shapes:** Most components (Bar, Area, Dot) allow for a `shape` prop, which accepts a custom SVG path or a React element.

For more details, visit the [Official Recharts Documentation](https://recharts.org/).
