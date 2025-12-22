# Recharts Examples & Detailed Guide

This document provides a detailed explanation of specific chart variations and configurations as requested.

---

## LineChart Variations

- **Simple Line Chart**: Standard line chart with a single data series.
- **Tiny Line Chart**: A miniaturized version, often used as a sparkline without axes or grids.
- **Dashed Line Chart**: Uses the `strokeDasharray` prop on the `<Line />` component to create a dashed effect.
- **Vertical Line Chart**: Swaps the roles of X and Y axes; data is plotted vertically.
- **Biaxial Line Chart**: Features two Y-axes (left and right) to compare two series with different scales.
- **Vertical Line Chart With Specified Domain**: A vertical line chart where the Y-axis (now horizontal in visual orientation) has a custom min/max range.
- **Line Chart Connect Nulls**: Uses the `connectNulls` prop to draw a continuous line even when some data points are missing (null).
- **Line Chart With X Axis Padding**: Adds extra space at the beginning and end of the X-axis using the `padding` prop.
- **Line Chart With Reference Lines**: Includes horizontal or vertical lines (e.g., target or average) using the `<ReferenceLine />` component.
- **Customized Dot Line Chart**: Replaces standard data points with custom SVG shapes or components using the `dot` prop.
- **Customized Label Line Chart**: Displays custom text or values directly on the lines using the `label` prop.
- **Synchronized Line Chart**: Links multiple charts so that hovering over one triggers the same tooltip/active state in others (using a shared `syncId`).
- **Highlight And Zoom Line Chart**: Implements interactive zooming by clicking and dragging over a section of the chart.
- **Line Chart Has Multi Series**: A standard chart plotting multiple lines simultaneously.
- **Line Chart Axis Interval**: Controls the frequency of labels on the axis using the `interval` prop (e.g., show every 2nd label).
- **Line Chart Negative Values With Reference Lines**: Demonstrates how lines behave when crossing zero, often paired with a reference line at Y=0.
- **Compare Two Lines**: A specific visualization focused on the gap or relationship between two distinct data series.

---

## AreaChart Variations

- **Simple Area Chart**: A basic area chart showing a single shaded region.
- **Stacked Area Chart**: Multiple areas stacked on top of each other to show a cumulative total.
- **Area Chart Connect Nulls**: Similar to LineChart, bridges gaps in data shaded regions.
- **Cardinal Area Chart**: Uses a custom curve type (`type="cardinal"`) for smoother, rounded edges.
- **Percent Area Chart**: Stacks data and normalizes the total to 100% at every point on the X-axis.
- **Synchronized Area Chart**: Multiple area charts linked by a shared `syncId`.
- **Tiny Area Chart**: A compact area chart/sparkline.
- **Area Chart Fill By Value**: Uses gradients or multiple layers to change the fill color based on whether the value is positive or negative.

---

## BarChart Variations

- **Tiny Bar Chart**: A compact, minimal bar chart.
- **Simple Bar Chart**: The standard discrete comparison chart.
- **Stacked Bar Chart**: Bars from different series placed on top of each other.
- **Mix Bar Chart**: A combination of stacked and unstacked (clustered) bars in one view.
- **Custom Shape Bar Chart**: Uses the `shape` prop to render bars as custom SVG elements (e.g., rounded tops or triangles).
- **Positive and Negative Bar Chart**: Bars extending above and below a central zero axis.
- **Brush Bar Chart**: Includes a slider (the `<Brush />` component) to scroll through large datasets.
- **Bar Chart With Customized Event**: Implements custom logic (like `onClick`) on individual `<Bar />` or `<Cell />` elements.
- **Bar Chart With Min Height**: Ensures very small values are still visible by setting a `minPointSize`.
- **Bar Chart Stacked By Sign**: Automatically stacks positive values above the axis and negative values below.
- **Biaxial Bar Chart**: Two Y-axes for comparing bars with different units/scales.
- **Bar Chart with background**: Displays a faint background bar behind the actual data bar using `background` prop.
- **Bar Chart With Multi X Axis**: Uses multiple horizontal axes to categorize data.
- **Ranged Stacked Bar Chart**: Values are defined by a range (start and end) rather than starting from zero.
- **Population Pyramid**: A back-to-back bar chart variation often used for demographic data.
- **Timeline**: A specialized bar chart where bars represent intervals of time.

---

## ComposedChart Variations

- **Line Bar Area Composed Chart**: Combines all three major visual types in one coordinate system.
- **Same Data Composed Chart**: Renders the same data key as both a Bar and a Line for emphasis.
- **Vertical Composed Chart**: The vertical orientation of a multitype chart.
- **Composed Chart With Axis Labels**: Features complex, multi-line, or custom axis labels.
- **Scatter And Line Of Best Fit**: Combines scatter points with a line representing a trend or regression.
- **Banded Chart**: An Area chart used to show a range (e.g., high/low) with a Line in the middle.
- **Target Price Chart with active Label**: A complex composed view with interactive labels highlighting specific technical levels.

---

## ScatterChart Variations

- **Simple Scatter Chart**: Plotting X-Y coordinates as dots.
- **Three Dim Scatter Chart**: Adds a third dimension (size) using the `<ZAxis />`, creating a bubble effect.
- **Joint Line Scatter Chart**: Connects scatter points with a line in the order they appear in the data.
- **Bubble Chart**: A ScatterChart where the dot radius represents a third variable.
- **Scatter Chart With Labels**: Direct text labels attached to individual points.
- **Multiple Y Axes Scatter Chart**: Comparing points against two different Y-axis scales.
- **Scatter Chart With Cells**: Color-coding individual dots using the `<Cell />` component.
- **Scatter Chart with many points**: Optimized rendering for high-density datasets.

---

## PieChart Variations

- **Two Level Pie Chart**: Nested rings showing a hierarchy (e.g., category and sub-category).
- **Straight Angle Pie Chart**: A semi-circle or partial pie (e.g., startAngle={180}, endAngle={0}).
- **Custom Active Shape Pie Chart**: Changes the visual style of a slice when hovered or clicked (using the `activeShape` prop).
- **Pie Chart With Customized Label**: Custom lines or text pointers pointing to slices.
- **Pie Chart with gap and rounded corners**: Uses the `paddingAngle` and `cornerRadius` props for a modern look.
- **Pie Chart With Needle**: Often used for gauges; a line (needle) pointing to a value on the pie's circumference.
- **Pie Chart in Flexbox/Grid**: Demonstrates how to handle container sizing in modern CSS layouts.

---

## Specialized Charts

- **RadarChart**: Multivariate data on a spider-web grid.
- **RadialBarChart**: Circular bars, often used for "rings" of progress or circular comparisons.
- **TreeMap**: Nested rectangles representing hierarchy and scale.

---

## Core Component Features

- **Tooltip - Custom Content**: Using the `content` prop to inject a custom React component into the hover popover.
- **Legend - Opacity**: Interactively changing the transparency of chart series by clicking on legend items.
- **ResponsiveContainer**: A wrapper that makes charts responsive to their parent's width and height.
- **XAxis - Multiple Axes**: Using `xAxisId` to map different data series to different horizontal scales.
