I have this libs on my react project and I need to learn everything about it:
# Frontend Charts & Recharts Architecture

This document details the architecture, implementation, and usage patterns of charts in the `POR.DesembarqueNavios.FrontEnd` project.

## 1. Overview

The project primarily uses **[Recharts](https://recharts.org/)** as the underlying charting library. However, instead of using Recharts components directly in pages, the project abstracts them into **Wrapper Components** located in `src/components/structure/Charts`.

This abstraction layer ensures:
- **Consistent Styling**: Unified fonts, grids, and responsive behaviors.
- **Standardized Legends**: A shared `ChartLegend` component.
- **Simplified API**: Complex Recharts configurations (margins, axis settings) are hidden.

## 2. Directory Structure

All chart-related components are located in:
`src/components/structure/Charts`

| Component | Type | Underlying Lib | Description |
|-----------|------|----------------|-------------|
| **LineChart** | Wrapper | Recharts (`LineChart`) | Standard line chart with legend and grid. |
| **StackedBarChart** | Wrapper | Recharts (`BarChart`) | Supports stacked bars, double X-axis (ticks), and custom tooltips. |
| **ScatterChart** | Wrapper | Recharts (`ScatterChart`) | For displaying distribution of data points. |
| **RadarChart** | Wrapper | Recharts (`RadarChart`) | For multivariate data. |
| **ShipChart** | **Custom** | *None* (Pure React/SVG) | Domain-specific visualization of ship holds/basements. |
| **ChartLegend** | Component | *None* | Shared legend component used by all wrappers. |

---

## 3. Recharts Wrappers Architecture

The wrapper components generally follow an **Inversion of Control** pattern. They handle the *Chart Shell* (Layout, Grid, Axes) but ask the parent to provide the *Data Elements* (Lines, Bars) via render props.

### 3.1 LineChart (`LineChart.jsx`)
**File**: `src/components/structure/Charts/LineChart/LineChart.jsx`

Wraps `<LineChart>`, `<CartesianGrid>`, `<XAxis>`, `<YAxis>`, `<ResponsiveContainer>`.

**Props API:**
- `title` (string): Chart title.
- `data` (array): Array of data objects.
- `dataKey` (string): Key in data objects for the X-Axis.
- `legends` (array): Array of strings for the legend.
- **`renderLines` (func)**: A function that must return Recharts `<Line />` components.

**Internal Behavior:**
- Sets specific margins (`top: 30, right: 20`).
- Configures `XAxis` with padding.
- Automatically places a `<ChartLegend>` at the bottom using `StyledDashboard.fillcolors`.

### 3.2 StackedBarChart (`StackedBarChart.jsx`)
**File**: `src/components/structure/Charts/StackedBarChart/StackedBarChart.jsx`

Wraps `<BarChart>` and implements advanced features like **Double X-Axes** (one for categories, one for ticks).

**Props API:**
- `renderBars` (func): Function returning Recharts `<Bar />` components.
- `tick` (bool): If true, renders a secondary X-Axis for grouped ticks (e.g., Months).
- `tickKey` (string): Data key for the secondary axis.
- `customTooltip` (func): Render function for a custom tooltip component.

**Key Implementation Detail (Custom Axis):**
It uses a secondary `<XAxis xAxisId="tick" />` with a custom SVG tick renderer (`renderTick`) to draw grouped labels with connectors (polylines) below the main axis.

---

## 4. Custom Visualizations: The `ShipChart`

**File**: `src/components/structure/Charts/ShipChart/ShipChart.jsx`

Unlike the others, `ShipChart` does **not** use Recharts. It is a custom domain visualization representing a ship's layout.

**Implementation:**
- **Layout**: CSS Flexbox/Grid (`ShipChart.styles.js`).
- **Images**: Uses SVG assets for `ShipHead` (bow) and `ShipStern` (stern).
- **Basements ('Porões')**: Iterates over `data.basements` and renders a `<ShipBody>` component for each hold.
- **Responsiveness**: Detects `isLargeShip` (<= 5 basements) to adjust widths and label sizing dynamically.

---

## 5. Usage Patterns & Examples

To use a chart, you import the wrapper and the specific Recharts definition component (`Bar`, `Line`) you need.

### Example: Implementing a Stacked Bar Chart (`TotalVolume.jsx`)

**1. Import Wrapper and Shape:**
```javascript
import { Bar } from 'recharts';
import StackedBarChart from 'components/structure/Charts/StackedBarChart';
```

**2. Define the Render Function:**
The parent component controls how the bars look (color, grouping) by defining `renderBars`.

```javascript
const renderBars = () =>
  arrayBars.map((element) => (
    <Bar
      key={element.product}
      dataKey={element.product} // Connects to the 'data' prop object keys
      stackId="a"               // Enables stacking
      fill={element.fillColor}  // Dynamic color from data
    />
  ));
```

**3. Define Custom Tooltip (Optional):**
Recharts tooltips are fully customizable via the `content` prop, exposed as `customTooltip` in the wrapper.

```javascript
const customTooltip = ({ active, payload, label }) => {
  if (active && payload) {
    // Custom logic to calculate totals or format values
    return <MyCustomTooltipComponent label={label} payload={payload} />;
  }
  return null;
};
```

**4. Render the Wrapper:**
```javascript
<StackedBarChart
  data={data}           // [{ month: 'Jan', productA: 10, productB: 20 }, ...]
  dataKey="cradle"      // X-Axis Key
  legends={legendData}  // For the bottom legend
  renderBars={renderBars} // Pass the render function
  customTooltip={customTooltip}
/>
```

---

## 6. Styling & Legends (`ChartLegend`)

Legends are decoupled from Recharts' internal legend system to allow for greater styling control.

**Component**: `src/components/structure/Charts/ChartLegend/ChartLegend.jsx`
- **Usage**: Automatically included inside the chart wrappers.
- **Props**: Accepts `legends` array `{ title, color }`.
- **Styles**: Uses `ChartLegend.styles.js` to render square indicators aligned with text.

## 7. Best Practices for This Project

1.  **Do Not Import Recharts Container Directly**: Always use the wrappers in `structure/Charts` to ensure the grid, axes, and responsive container match the design system.
2.  **Use `renderProp` for Series**: Keep the data series definition (`<Bar>`, `<Line>`) in the parent component logic (e.g., `TotalVolume.jsx`). This keeps data transformation logic close to the data source.
3.  **Data Formatting**: Ensure your API data is transformed into a flat object structure expected by Recharts (e.g., `{ name: 'Page A', uv: 4000, pv: 2400 }`) before passing it to the wrapper.

Search on internet, gather knowledge, imagine concepts of POCs to use those libs in order to help me to prepare to work

This is a robust and scalable frontend architecture. It separates **layout/configuration** (the Wrappers) from **data definition** (the Parent pages), which is a high-maturity pattern in React development.

Here is a comprehensive breakdown of the concepts, mechanics, and practical implementations you need to master this codebase.

-----

### 1\. The Core Concept: Inversion of Control

The most critical thing to understand is the **Render Prop Pattern** used in your wrappers.

* **Standard Way (Bad for large apps):** The Chart component accepts a massive config object (`options`, `colors`, `axes`). This makes the component huge and hard to maintain.
* **Your Project's Way (Good):** The Wrapper handles the *container* (Grid, Axes, Size), but asks the *Parent* to render the actual graphics (Lines, Bars).

**Visualizing the Responsibility Split:**

| Responsibility | Component | Code Example |
| :--- | :--- | :--- |
| **The "Canvas"** | `Wrapper` | Sets up `<ResponsiveContainer>`, `<XAxis>`, `<CartesianGrid>`. |
| **The "Paint"** | `Parent Page` | Defines `<Line dataKey="speed" color="red" />`. |

-----

### 2\. Deep Dive: The Recharts Wrappers

#### A. The `renderLines` / `renderBars` Pattern

This is how data is injected into the chart.

**How it works internally (Conceptual Code):**
The Wrapper (`LineChart.jsx`) basically does this:

```jsx
// Inside LineChart.jsx Wrapper
return (
  <RechartsLineChart data={data}>
    <CartesianGrid />
    <XAxis />
    <YAxis />
    {/* ⬇️ THIS IS THE MAGIC. It calls the function you passed in. */}
    {renderLines()} 
  </RechartsLineChart>
);
```

**Why this is powerful:** You can conditionally render lines, change colors, or add animations in the *Parent* without touching the complex Wrapper code.

#### B. The `StackedBarChart` & Double Axis

The documentation mentions a **Secondary X-Axis**. This is a specific Recharts trick used to group data visually.

* **Axis 1 (Hidden or Data):** Handles the actual stacking of bars.
* **Axis 2 (Visual):** Renders the "ticks" (labels) with custom grouping.

**Key Recharts Prop:** `xAxisId`.
If you see `<XAxis xAxisId="tick" />` in the code, it means that axis is distinct from the default one (id "0"). This is often used to draw the custom polylines/connectors mentioned in your docs.

-----

### 3\. The `ShipChart`: Pure SVG Visualization

[Image of container ship cross section]

The `ShipChart` does not use a library. It is "drawing with code." This is common for domain-specific diagrams where a standard bar/line chart doesn't fit.

**How it likely works (The Logic):**
It treats the ship like a massive grid.

1.  **Data:** You receive a JSON like `{ basements: [ { id: 1, load: 80% }, { id: 2, load: 20% } ] }`.
2.  **Mapping:** It maps this array to HTML/SVG elements.
3.  **Styling:** CSS Grid or Flexbox positions them to look like a ship.

**Simplified Mental Model:**

```jsx
// Pseudo-code for ShipChart
<div className="ship-container">
  <ShipHead /> {/* SVG Image */}
  
  <div className="basements-container">
    {data.basements.map(hold => (
      <div className="hold" style={{ opacity: hold.load }}>
        {hold.id}
      </div>
    ))}
  </div>

  <ShipStern /> {/* SVG Image */}
</div>
```

-----

### 4\. Proof of Concept (POC) Exercises

To prepare for work, try building these 3 POCs in a sandbox (like CodeSandbox) or a scratchpad file in the project.

#### POC 1: The "Consumer" (Basic)

**Goal:** Create a Multi-Line Chart using the existing architecture pattern.

```javascript
// MyNewDashboard.jsx
import LineChart from 'components/structure/Charts/LineChart';
import { Line } from 'recharts';

const MyNewDashboard = () => {
  const data = [
    { hour: '08:00', speed: 10, fuel: 50 },
    { hour: '09:00', speed: 15, fuel: 45 },
  ];

  // 1. Define the "Paint"
  const renderMyLines = () => (
    <>
      <Line type="monotone" dataKey="speed" stroke="#FF0000" name="Speed (kts)" />
      <Line type="monotone" dataKey="fuel" stroke="#00FF00" name="Fuel (%)" />
    </>
  );

  // 2. Pass it to the "Canvas"
  return (
    <LineChart
      title="Engine Performance"
      data={data}
      dataKey="hour" // What to show on X Axis
      legends={[{ title: 'Speed', color: 'red' }, { title: 'Fuel', color: 'green' }]}
      renderLines={renderMyLines}
    />
  );
};
```

#### POC 2: The "Custom Tooltip" (Intermediate)

**Goal:** Intercept the hover data to show a calculation.

```javascript
// Define this function inside your component
const customTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // payload[0].payload is the raw data object for this slice
    const rawData = payload[0].payload;
    const efficiency = (rawData.speed / rawData.fuel).toFixed(2);

    return (
      <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p><strong>Time: {label}</strong></p>
        <p>Speed: {rawData.speed}</p>
        <p style={{ color: 'blue' }}>Efficiency Index: {efficiency}</p>
      </div>
    );
  }
  return null;
};

// Pass to wrapper:
// <StackedBarChart ... customTooltip={customTooltip} />
```

#### POC 3: The "Ship Component" (Advanced)

**Goal:** Render a list of items as a graphical representation without a library.

```javascript
const MiniShipPOC = ({ compartments }) => {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '100px', borderBottom: '2px solid black' }}>
      {/* Ship Head */}
      <div style={{ width: 0, height: 0, borderBottom: '50px solid gray', borderRight: '20px solid transparent' }} />
      
      {/* Dynamic Compartments */}
      {compartments.map((comp) => (
        <div 
          key={comp.id}
          style={{
            width: '40px',
            height: `${comp.fillLevel}%`, // Data-driven height
            backgroundColor: comp.fillLevel > 80 ? 'red' : 'blue', // Data-driven color
            transition: 'all 0.3s'
          }}
          title={`Compartment ${comp.id}: ${comp.fillLevel}%`}
        />
      ))}

      {/* Ship Stern */}
      <div style={{ width: 20, height: 50, background: 'gray' }} />
    </div>
  );
};

// Usage: <MiniShipPOC compartments={[{id:1, fillLevel: 50}, {id:2, fillLevel: 90}]} />
```

-----

### 5\. Your Cheatsheet for Daily Work

| Task | Where to look | What to do |
| :--- | :--- | :--- |
| **Change Grid Color** | `Wrapper` (e.g., `LineChart.jsx`) | Edit `<CartesianGrid stroke="..." />` props. |
| **Add a new Line** | `Parent Page` (e.g., `Dashboard.jsx`) | Add another `<Line />` to your `renderLines` function. |
| **Format Tooltip Values** | `Parent Page` | Create a `customTooltip` function and pass it to the wrapper. |
| **Fix "Axis truncated"** | `Wrapper` | Check the `margin` prop on the internal `<BarChart>` or `<LineChart>`. |
| **Ship looks wrong on mobile** | `ShipChart.jsx` | Look for the `isLargeShip` logic or CSS media queries. |

### Next Step

Would you like me to generate the actual **React code for the `StackedBarChart` wrapper** based on this description, so you can inspect how the `xAxisId` and `renderBars` props are likely wired together?

Here are 4 specific POC (Proof of Concept) ideas designed to push the limits of **Recharts** and React.

These move beyond simple "display data" tasks and into **interactive, real-time, and mathematical** domains. Implementing these will force you to master the library's internal lifecycle, event handling, and SVG customization.

-----

### POC 1: The "Live Stock Ticker" (Real-Time Data Simulation)

**Concept:** A line chart that updates every second, simulating a live stock price or live sensor reading from a ship (e.g., "Engine RPM").
**Challenge:** Recharts animates data entry by default. Handling smooth updates without "jumping" requires understanding specific props.

* **What you will build:** A chart that holds exactly 60 seconds of data. As new data comes in, old data slides out.
* **Key Recharts Concepts:** `isAnimationActive`, Stable Array Keys, React State Management.

**Implementation Strategy:**

1.  **Data Source:** `setInterval` inside a `useEffect` adding a random value `Math.random()` to an array.
2.  **The Wrapper:** Use your `LineChart` wrapper.
3.  **The Trick:** To make it look like a "ticker" and not a "redraw," you often need to disable the initial animation for updates or manage the `key` prop carefully.

<!-- end list -->

```javascript
// Render Prop Logic
const renderLiveLine = () => (
  <Line 
    type="monotone" 
    dataKey="value" 
    stroke="#8884d8" 
    dot={false} // Hide dots for a "ticker" look
    isAnimationActive={false} // CRITICAL for smooth real-time updates
  />
);

// Parent Logic
// Maintain an array of exactly 50 items. 
// When adding a new item, .shift() the oldest one.
```

**What you learn:** How Recharts handles DOM updates and performance with rapidly changing data.

-----

### POC 2: The "Equation Plotter" (Mathematical Projection)

**Concept:** Instead of fetching data from an API, you **generate** the data using math formulas ($y = x^2$, $y = \sin(x)$). This is useful for "Predictive Modeling"—overlaying a theoretical "perfect curve" against real noisy data.

* **What you will build:** A chart that plots a Parabola and a Sine wave.
* **Key Recharts Concepts:** `ComposedChart` (mixing lines/areas), Data Generation, ReferenceLines.

**Implementation Strategy:**

1.  **Data Generation:** Create a utility function that loops from $x = -10$ to $x = 10$ and pushes objects: `{ x: i, parabola: i*i, sine: Math.sin(i) }`.
2.  **The Visuals:**
    * Render the math curve as a thick, transparent dashed line (the "prediction").
    * Render "real" data points as a Scatter plot or solid line on top.
3.  **Reference Lines:** Use `<ReferenceLine y={0} />` and `<ReferenceLine x={0} />` to create a Cartesian coordinate system (crosshairs) in the center.

**What you learn:** How to manipulate the **Data Domain**. Recharts usually auto-calculates axes. Here, you will force the `domain={['dataMin', 'dataMax']}` on the Axis to make the math look correct.

-----

### POC 3: Interactive "Zoom & Drill-down" Analysis

**Concept:** A dense chart (e.g., 365 days of data). When the user clicks and drags (selects an area), the chart zooms into that timeframe.
**Challenge:** Your current `LineChart` wrapper likely *hides* the `<XAxis>` configuration. You might need to expose props to control the `domain` (min/max values) of the axes.

* **What you will build:** A "Ship Velocity History" chart.
* **Key Recharts Concepts:** `ReferenceArea` (for the selection box), `onMouseDown`/`onMouseUp` events.

**Implementation Logic:**

1.  **State:** Track `leftIndex` and `rightIndex` in the parent state.
2.  **Interaction:**
    * `onMouseDown`: Set starting label.
    * `onMouseMove`: Update `ReferenceArea` end label (draws a grey selection box).
    * `onMouseUp`: Calculate new Axis Domain based on selection and update the chart.
3.  **Reset:** A button to set the Axis Domain back to `null` (auto).

**What you learn:** How to control the **View Port** of the chart manually, which is essential for building dashboards for heavy-data users (engineers, analysts).

-----

### POC 4: The "Custom Marker" Stock Strategy (SVG Injection)

**Concept:** A stock chart that doesn't just show the price, but uses **custom icons** to show "Buy" and "Sell" signals directly on the line.

* **What you will build:** A price chart where every "peak" has a red down-arrow and every "valley" has a green up-arrow.
* **Key Recharts Concepts:** The `dot` prop and `shape` prop. You can pass a full React Component to render the dots.

**Implementation Strategy:**

```javascript
// The Custom Component
const SignalMarker = (props) => {
  const { cx, cy, payload } = props; // cx/cy are coordinates provided by Recharts
  if (payload.action === 'BUY') {
    return <circle cx={cx} cy={cy} r={8} fill="green" />; // Or an SVG Arrow Up
  }
  if (payload.action === 'SELL') {
    return <circle cx={cx} cy={cy} r={8} fill="red" />; // Or an SVG Arrow Down
  }
  return null; // Don't render anything for neutral days
};

// The Render Prop
const renderLineWithSignals = () => (
  <Line 
    dataKey="price" 
    dot={<SignalMarker />} // ⬅️ Injecting your custom component here
  />
);
```

**What you learn:** How to break out of the library's default styling. This is how you build "Smart Charts" that tell a story (e.g., "This specific ship hold exceeded weight limits here").

-----

### Summary of Learning Path

| POC | Difficulty | Concept Mastered |
| :--- | :--- | :--- |
| **Equation Plotter** | Easy | Data generation & Axis domains. |
| **Custom Markers** | Medium | Injecting SVG components into Chart internals. |
| **Live Ticker** | Medium | React State lifecycle vs. Recharts Animation. |
| **Zoom/Interactive** | Hard | Controlling the Axis Domain state manually (requires lifting state out of the wrapper). |

### Next Step

Which one of these sounds most fun or relevant to you? I can write the full code for one of them so you can copy-paste it into your project and start tinkering.

This is a significant step up from simple chart rendering. You are now moving from **"using a library"** to **"building a Product"**. The images you shared (Dashboard, Filters, Ordering) describe a full **Business Intelligence (BI) Application**.

To achieve this result while respecting the architecture we discussed, you need to implement three distinct "Systems" that work together.

Here is your roadmap to building a POC that mimics this exact dashboard.

-----

### System 1: The "Dashboard Engine" (Layout & Ordering)

**Goal:** Replicate the functionality shown in `Ordenação.png`, where users can choose which charts appear and in what order.

**The Problem:** You cannot hardcode `<LineChart />` then `<BarChart />` in your JSX. The page needs to be dynamic.

**The Solution (Map & Render Pattern):**
Create a "Widget Registry" that maps string IDs to your actual components.

```javascript
// 1. The Registry (Mapping IDs to Components)
const WIDGET_REGISTRY = {
  quality_gauge: { component: QualityGaugeWrapper, title: "Nível de Qualidade" },
  ship_kpi: { component: ShipKpiCard, title: "Tempo Total do Navio" },
  volume_chart: { component: VolumeBarChart, title: "Volume Total" },
  tiplam_line: { component: TiplamLineChart, title: "TIPLAM B4 Navios" },
};

// 2. The Dashboard Component
const DynamicDashboard = ({ userConfig }) => {
  // userConfig comes from your backend/localstorage based on "Ordenação.png"
  // Example: ['quality_gauge', 'volume_chart', 'tiplam_line']

  return (
    <div className="dashboard-grid">
      {userConfig.map((widgetId) => {
        const Widget = WIDGET_REGISTRY[widgetId];
        if (!Widget) return null;
        
        return (
          <div key={widgetId} className="widget-card">
            <h3>{Widget.title}</h3>
            <Widget.component />
          </div>
        );
      })}
    </div>
  );
};
```

**Why this helps:** This makes the "Ordenação" modal easy to build. That modal simply manipulates an array of strings (`['a', 'b', 'c']` -\> `['c', 'a', 'b']`), and the dashboard updates automatically.

-----

### System 2: The "Global Filter Context"

**Goal:** Make the sidebar in `Filtros.png` drive every single chart on the screen simultaneously.

**The Architecture:**
Do **not** pass props down through 10 layers. Use React Context or a store (Zustand/Redux).

1.  **The Context:** Holds the state of `{ dateRange, product, port, operationalStops }`.
2.  **The Wrapper Connection:** Your `LineChart` and `StackedBarChart` wrappers should listen to this context to fetch data.

<!-- end list -->

```javascript
// Inside your Wrapper Component (e.g., StackedBarChart.jsx)
const StackedBarChart = (props) => {
  const { filters } = useDashboardContext(); // ⬅️ Access global filters

  // Ideally, use a hook to fetch data based on filters
  const { data, isLoading } = useChartData(props.endpoint, filters);

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <RechartsBarChart data={data}>
       {/* ... existing implementation ... */}
    </RechartsBarChart>
  );
}
```

-----

### System 3: Advanced Recharts Visualizations (The "Proposta" Look)

The image `Proposta.jpg` shows specific chart types that are **not native** to Recharts. You have to "trick" the library.

#### A. The "Gauge" Chart (Nível de Qualidade) Recharts does not have a `<Gauge />`. You build it using a **Pie Chart** that is cut in half.

* **Technique:** Use `<Pie>` with `startAngle={180}` and `endAngle={0}`.
* **The Needle:** You must render a custom SVG pointer using the `cx` and `cy` coordinates provided by the Pie chart.

**POC Code for the Gauge:**

```javascript
<PieChart width={400} height={200}>
  <Pie
    dataKey="value"
    startAngle={180}
    endAngle={0}
    data={data}
    cx="50%"
    cy="100%" // Moves the center to the bottom to look like a semicircle
    innerRadius={60}
    outerRadius={80}
    paddingAngle={5}
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
  {/* You need a custom SVG function here to draw the needle based on the value */}
  {renderNeedle(value, cx, cy, innerRadius, outerRadius)}
</PieChart>
```

#### B. The "Dual Axis" Line Chart (TIPLAM B4)

The chart at the bottom left of `Proposta.jpg` shows lines against different scales (Left Axis: 200-400, Right Axis: 40%-100%).

* **Technique:** You need **two** `<YAxis>` components.
* **Link:** Each `<Line>` must specify which axis it belongs to using `yAxisId`.

<!-- end list -->

```javascript
// Inside your LineChart Wrapper
<YAxis yAxisId="left" orientation="left" />
<YAxis yAxisId="right" orientation="right" unit="%" />

<Line yAxisId="left" dataKey="navios" stroke="blue" />
<Line yAxisId="right" dataKey="efficiency" stroke="green" />
```

-----

### System 4: The Filter UI Components

The `Interval Picker.png` and dropdowns in `Filtros.png` are standard UI forms.

* **Date Range:** Don't build this from scratch. Use a library like `react-datepicker` or `mui-datepicker` that supports the "start date -\> end date" selection visual shown in your image (blue highlight between dates).
* **Ordering UI:** For the drag-and-drop list shown in `Ordenação.png`, use **`dnd-kit`** or **`react-beautiful-dnd`**. It handles the "drag handle" logic perfectly.

### Suggested Execution Plan (Next Steps)

1.  **Step 1 (The Data Shape):** Define the JSON structure for the "Filters" object. (e.g., `startDate`, `endDate`, `selectedPorts[]`).
2.  **Step 2 (The Gauge POC):** Try to render a "Half Pie" chart in a blank file. This is the hardest visual part.
3.  **Step 3 (The Registry):** Create a generic "Dashboard" page that renders a list of hardcoded components, then try to swap their order using a simple array.

Would you like me to write the **detailed code for the Gauge Chart (Half-Pie with Needle)**? That is usually the biggest blocker in replicating this specific design.

Based on the screenshots you provided (`Filtros`, `Proposta`, `Ordenação`, `Interval Picker`), here are the **4 specific POCs (Proof of Concepts)** you should build.

These are designed to tackle the **highest-risk technical challenges** visible in your UI designs that are not covered by the basic chart documentation.

-----

### POC 1: The "Gauge Meter" (Recharts Hack)

**Why:** The design in `Proposta.jpg` ("Nível de qualidade do planejamento") shows a speedometer/gauge. **Recharts does not have a `<Gauge>` component.** You must build this yourself using a "Half-Pie Chart."

**The Challenge:** Creating a semicircle, customizing the colors to match the design (Red/Yellow/Green), and calculating the trigonometry for the "Needle" animation.

**Implementation Strategy:**

1.  **Wrapper:** Create `GaugeChart.jsx`.
2.  **Base:** Use `<PieChart>` with `startAngle={180}` and `endAngle={0}` to create the semi-circle.
3.  **Needle:** You must render a custom SVG `<path>` or `<line>` inside the chart. You will need a simple math function to convert the `value` (0-100) into an angle (radians) to position the needle tip.

<!-- end list -->

```javascript
/* Conceptual Math for the Needle */
const RADIAN = Math.PI / 180;
const cx = 150; // Center X
const cy = 150; // Center Y (Bottom of the half-pie)
const angle = 180 * (1 - value / 100); // Convert 0-100 value to angle
const x = cx + radius * Math.cos(-angle * RADIAN);
const y = cy + radius * Math.sin(-angle * RADIAN);
// Draw line from (cx, cy) to (x, y)
```

-----

### POC 2: The "Widget Registry" (Dynamic Ordering)

**Why:** `Ordenação.png` proves that users can choose *which* charts to see and in *what order*. You cannot hardcode your dashboard like `<ChartA /><ChartB />`.

**The Challenge:** Mapping string IDs (e.g., `"volume_chart"`) to actual React components and allowing them to be reordered without destroying their internal state.

**Implementation Strategy:**

1.  **The Map:** Create a constant object:
    ```javascript
    const WIDGETS = {
      'quality_gauge': { title: 'Qualidade', component: GaugeChart },
      'tiplam_navios': { title: 'TIPLAM B4', component: DualAxisLineChart },
      // ... others
    };
    ```
2.  **The State:** Maintain an array of IDs: `['quality_gauge', 'tiplam_navios']`.
3.  **The Renderer:** Loop through that array to render.
4.  **The POC:** Build a simple list where clicking "Up" or "Down" buttons changes the array order, and verify that the "Chart" moves visually on the screen.

-----

### POC 3: The "Global Filter Context" (Deep State)

**Why:** In `Filtros.png`, a sidebar filter (e.g., "Portos", "Produtos") needs to update *every single chart* on the dashboard simultaneously. Passing props down 5 levels (`Dashboard -> Layout -> Grid -> Card -> Chart`) is messy.

**The Challenge:** Efficiently updating the data fetching params for 6+ distinct widgets when one dropdown changes.

**Implementation Strategy:**

1.  **Context:** Create a `DashboardContext` that holds `{ selectedPort, dateRange, product }`.
2.  **Hook:** Create a custom hook `useDashboardFilters()` that any chart wrapper can consume.
3.  **Simulation:** Create 3 "Dummy Charts" (just colored divs with text). Change a dropdown in a "Sidebar" component and verify all 3 divs update their text immediately to reflect the new filter.

-----

### POC 4: The "Dual-Axis Combo" (Complex Visualization)

**Why:** In `Proposta.jpg` (bottom left "TIPLAM B4 NAVIOS"), the chart plots two different types of data:

1.  **Bars/Lines (Navios):** Integer counts (e.g., 200, 300).
2.  **Lines (Speed/Efficiency):** Percentages (e.g., 40%, 100%).

**The Challenge:** If you plot these on one axis, the percentages (0.4, 0.9) will be invisible flat lines at the bottom because the ship counts (300) are so huge.

**Implementation Strategy:**

1.  **Wrapper:** Extend your `LineChart` or `StackedBarChart` wrapper.
2.  **Y-Axes:** You must implement **two** `<YAxis>` components with unique IDs.
    * `<YAxis yAxisId="left" />` (For counts)
    * `<YAxis yAxisId="right" orientation="right" />` (For percentages)
3.  **Series Binding:** Bind specific lines to specific axes: `<Line yAxisId="right" dataKey="speed" />`.

### Summary Checklist

| POC Name | Key Learning Goal | Related Image |
| :--- | :--- | :--- |
| **Gauge Meter** | Creating non-standard charts (SVG + Math). | `Proposta.jpg` (Top Left) |
| **Widget Registry** | Dynamic Layouts & Reordering. | `Ordenação.png` |
| **Filter Context** | State Management across the application. | `Filtros.png` |
| **Dual-Axis Combo** | Handling different data scales in one view. | `Proposta.jpg` (Bottom Left) |

**Recommendation:** Start with **POC 1 (Gauge Meter)**. It is the most "custom" visual element and usually the one that stakeholders scrutinize the most. If you get that working, the rest is standard React architecture.

To prepare for your ship dashboard project while keeping the topic exciting and focused on Math/Physics/Stocks, I recommend building a **"Quantitative Trading Command Center"** (let's call it **QuantDash**).

This project perfectly mimics the architectural challenges of your "Ship Dashboard" but uses financial data and math formulas, which are naturally more dynamic and "equation-heavy."

Here is how **QuantDash** maps directly to your work requirements, effectively training you for the job:

### The "QuantDash" Project Overview

**The Concept:** A dashboard for monitoring algorithmic trading bots. It displays live crypto/stock prices, calculates mathematical indicators (moving averages, standard deviations), and monitors "Portfolio Health" using gauges.

**The Mapping (Why this works):**

| Feature in **QuantDash** (Fun Project) | Feature in **Ship Project** (Work) | The Skill You Master |
| :--- | :--- | :--- |
| **"Fear & Greed" Meter** | **Quality/Acceptance Gauge** | Creating Custom Circular Charts (SVG Paths + Trig). |
| **Price vs. RSI (Dual Axis)** | **TIPLAM B4 (Counts vs. Speed)** | Handling Multi-Axis scales & Data Domains. |
| **Math Indicators (SMA/Bollinger)** | **Equation Plotter** | Data transformation & `composed` charts (Lines over Areas). |
| **Draggable Watchlist** | **Chart Ordering Modal** | `dnd-kit` (Drag & Drop) & Dynamic Widget Registries. |
| **Global "Timeframe" (1H, 1D, 1W)** | **Global Filter Sidebar** | React Context & Global State Management. |

---

### Phase 1: The "Math & Physics" Visuals (Recharts Deep Dive)

#### POC 1: The "Fear & Greed" Gauge (Recharts Hack)
**Goal:** Build the semi-circle gauge shown in your work proposal (`Proposta.jpg`), but use it to show "Market Sentiment" (0-100).

* **The Physics/Math:** You need to calculate the needle position using Trigonometry.
    * *Formula:* $x = r \cdot \cos(\theta)$, $y = r \cdot \sin(\theta)$.
* **The Implementation:**
    * Use `<PieChart>` with `startAngle={180}` `endAngle={0}`.
    * Create a custom component `<Needle value={sentiment} />` that renders an SVG line rotating based on the value.
    * **Bonus:** Make the needle "vibrate" slightly to simulate market volatility (CSS Animation).

#### POC 2: The "Bollinger Band" Plotter (Equation Chart)
**Goal:** You asked for an "Equation Plotter." In trading, "Bollinger Bands" are pure statistics: A Moving Average $\pm 2$ Standard Deviations ($2\sigma$).

* **The Challenge:** You will download raw price data, but you must **calculate** the Upper and Lower bands in JavaScript before passing it to Recharts.
* **The Chart:** A `<ComposedChart>`.
    * **Area:** The space between the Upper and Lower bands (use a `<Area>` with `fillOpacity`).
    * **Line:** The actual Stock Price on top.
* **Why this helps work:** This teaches you how to layer complex visual types (Areas behind Lines) which is often needed for "Target Zones" in ship planning.

---

### Phase 2: The Architecture (React Patterns)

#### POC 3: The "Draggable Watchlist" (Ordering)
**Goal:** Replicate the `Ordenação.png`.
Create a sidebar list of "Ticked Assets" (BTC, ETH, TSLA). Allow the user to drag them to reorder.

* **The Logic:**
    * Use **`@dnd-kit/core`** or **`react-beautiful-dnd`**.
    * Store the order in an array: `['BTC', 'ETH', 'TSLA']`.
    * **The Dashboard:** Map over this array. If 'BTC' is first, render the BTC chart first.
* **Why this helps work:** You will need this exact logic for the "Sortable Widgets" modal in your ship dashboard.

#### POC 4: The "Time-Travel" Context (Global Filters)
**Goal:** Replicate the `Filtros.png` logic.
Create a top bar with a "Date Range Picker" and a "Currency Converter" (USD vs EUR).

* **The Challenge:** When you switch from USD to EUR, **every chart** (Price, Volume, Portfolio Value) must update its Y-Axis numbers immediately without reloading the page.
* **The Pattern:**
    * Create `DashboardContext`.
    * Pass a `multiplier` (e.g., 0.85 for EUR) to all wrappers.
    * Inside the Wrapper: `data.map(item => item.value * multiplier)`.

---

### How to Start (The "Stack")

To make this feel like a real lab, set up your project with:
1.  **Vite + React** (Fastest setup).
2.  **Recharts** (The core lib).
3.  **dnd-kit** (For the drag-and-drop sorting).
4.  **date-fns** (For manipulating the time ranges).
5.  **TailwindCSS** (To quickly style the "Cards" and "Grid").

**Would you like me to generate the "Math Helper" function for the Gauge Needle (calculating the angle)?** That is usually the trickiest part of the visualization.

This is the **Technical Design Document (TDD)** for **"QuantDash"**.

This project is architected specifically to be a **training ground** for your actual work project. It replicates every complex pattern you will face (Wrappers, Global State, Dynamic Layouts, Math) but applies them to a "Quantitative Trading" context to keep the learning engaging.

-----

### 1\. High-Level Architecture: The "Onion" Model

We will use a **Layered Architecture** to separate concerns. This ensures that when you swap "Stock Data" for "Ship Data," the UI logic remains identical.

| Layer | Responsibility | Key Components |
| :--- | :--- | :--- |
| **1. Presentation (Views)** | The "Page" layout and Widget containers. | `Dashboard.jsx`, `WidgetCard.jsx`, `DragDropContext` |
| **2. Abstraction (Wrappers)** | Standardizing Recharts for the project. | `SentimentGauge`, `BollingerChart`, `VolumeCombo` |
| **3. Application State** | Global filters and User preferences. | `FilterContext` (Timeframe), `LayoutContext` (Order) |
| **4. Domain Logic** | Math & Data transformations. | `useIndicators`, `math-utils.js` (SMA, StdDev) |
| **5. Data Infrastructure** | Data generation/fetching. | `MockSocketService`, `MarketDataGenerator` |

-----

### 2\. Detailed Directory Structure

This structure mirrors your work project's `components/structure/Charts` but adds the necessary supporting layers.

```text
src/
├── assets/                # Icons, Static SVGs
├── components/
│   ├── common/            # Buttons, Dropdowns (UI Kit)
│   ├── layout/            # Sidebar, Header, Grid System
│   └── structure/         # THE CORE (Your Wrappers)
│       └── Charts/
│           ├── Base/              # Shared sub-components
│           │   ├── ChartLegend.jsx
│           │   ├── ChartTooltip.jsx
│           │   └── ResponsiveWrapper.jsx
│           ├── SentimentGauge/    # The "Nível de Qualidade" equivalent
│           ├── BollingerBand/     # The "Equation Plotter"
│           ├── DualAxisCombo/     # The "TIPLAM" equivalent
│           └── LiveTicker/        # Real-time data test
├── context/               # State Management
│   ├── FilterContext.jsx  # (Currency, TimeRange)
│   └── LayoutContext.jsx  # (Widget Ordering)
├── hooks/                 # Custom Business Logic
│   ├── useMarketData.js   # Facade for data fetching
│   └── useMath.js         # Calculation logic
├── services/
│   └── DataGenerator.js   # Fakes the API
└── pages/
    └── Dashboard.jsx      # Entry point
```

-----

### 3\. State Management & Data Flow

You need two distinct state "loops" to match the screenshots you sent.

#### A. The "Filter Loop" (Global Context)

*Replicates: `Filtros.png`*

* **Store:** `FilterContext`
* **State:** `{ timeRange: '1D', asset: 'BTC', currency: 'USD' }`
* **Mechanism:**
    1.  User changes Dropdown (Header) -\> Updates Context.
    2.  `useMarketData` hook listens to Context.
    3.  Hook triggers `DataGenerator` to fetch new data.
    4.  Charts re-render automatically.

#### B. The "Layout Loop" (Widget Registry)

*Replicates: `Ordenação.png`*

* **Store:** `LayoutContext`
* **State:** `{ widgetOrder: ['sentiment_gauge', 'price_chart', 'volume_stat'] }`
* **Pattern:** **Registry Pattern**.
    * We do not import components directly into the JSX grid. We look them up in a registry map.

-----

### 4\. The "Math Engine" (Data Layer)

Since we don't have a backend, we will build a **Deterministic Data Generator**. This allows you to explore "Equation Plotting."

**File:** `src/services/math-utils.js`

```javascript
// 1. Basic Sine Wave (Seasonality)
export const generateSineWave = (points = 100) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    value: Math.sin(i * 0.1) * 100 + 200 // Base price 200
  }));
};

// 2. Bollinger Bands (Standard Deviation)
// Needed for: "Equation Plotter" POC
export const calculateBollinger = (data, window = 20) => {
  return data.map((point, index, arr) => {
    if (index < window) return point; // Not enough data
    const slice = arr.slice(index - window, index).map(p => p.value);
    const mean = slice.reduce((a, b) => a + b, 0) / window;
    const stdDev = Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window);
    
    return {
      ...point,
      upper: mean + (stdDev * 2), // The Top Line
      lower: mean - (stdDev * 2), // The Bottom Line
      mean: mean
    };
  });
};
```

-----

### 5\. Detailed Component Blueprints

Here is the "X-Ray" of the key components you need to build.

#### A. The `SentimentGauge` (Wrapper)

*Goal: Replicate the "Quality Gauge" from `Proposta.jpg`.*

* **Underlying Lib:** Recharts `<PieChart>`
* **Props:** `{ value (0-100), label, themeColor }`
* **Internal Logic:**
    * **Pie Slice:** One slice (100%) filled gray (background), one slice (value%) filled color.
    * **Needle:** A separate functional component `Needle` that takes `value`, converts to radians, and returns an SVG `<path>`.
    * **Animation:** CSS `transition: transform 0.5s ease-out` on the needle group.

#### B. The `BollingerChart` (Wrapper)

*Goal: Replicate the "Equation Plotter" idea.*

* **Underlying Lib:** Recharts `<ComposedChart>`
* **Props:** `{ data, width, height }`
* **Internal Logic:**
    * **Area:** `<Area dataKey="range" />` (We construct a synthetic `range: [lower, upper]` data point or use `stackId` hacks). *Note: Recharts `<Area>` is best for simple fills. For bands, we usually draw two `<Line>`s and fill the space, or use an `<Area>` with a custom `baseValue`.*
    * **Line:** `<Line dataKey="value" />` (The actual price).
    * **ReferenceLine:** `<ReferenceLine y={avgPrice} />` (Average).

#### C. The `DashboardGrid` (Layout)

*Goal: Replicate `Ordenação.png`.*

* **Underlying Lib:** `@dnd-kit/core` + `@dnd-kit/sortable`
* **Logic:**
  ```javascript
  const WIDGETS = {
    'gauge': <SentimentGauge />,
    'bollinger': <BollingerChart />,
    'ticker': <LiveTicker />
  };

  // Render Loop
  {activeWidgets.map(id => (
    <SortableItem key={id} id={id}>
      {WIDGETS[id]}
    </SortableItem>
  ))}
  ```

-----

### 6\. Implementation Roadmap (Step-by-Step)

This is your battle plan. Execute in this order to minimize frustration.

#### **Phase 1: The "Static" Foundation**

1.  **Setup:** React + Vite + Recharts.
2.  **Wrappers:** Create `SentimentGauge.jsx` hardcoded with `value={75}`. Get the SVG needle math working.
3.  **Wrappers:** Create `BollingerChart.jsx`. Use static JSON data. Get the `<ComposedChart>` looking right.

#### **Phase 2: The "Dynamic" Math**

1.  **Service:** Write `DataGenerator.js`. Ensure it produces arrays of objects `{ time, value, vol }`.
2.  **Hook:** Create `useMarketData()`.
3.  **Integration:** Connect `BollingerChart` to `useMarketData`. Watch the chart render random data on refresh.

#### **Phase 3: The "Architectural" Glues**

1.  **Context:** Create `FilterContext`. Add a button "Switch to EUR".
2.  **Reaction:** Modify `useMarketData` to multiply values by 0.85 when EUR is selected. Watch charts update.

#### **Phase 4: The "Product" Polish**

1.  **DND:** Install `dnd-kit`. Wrap your widget list in `<SortableContext>`.
2.  **Modal:** Create the "Edit Layout" modal that reorders the ID array.

### Next Step

This blueprint gives you the **"What"** and **"How"**.
Would you like to start **Phase 1** by generating the **Math/Trig logic for the Gauge Needle**? That is the most isolated and "math-heavy" piece to solve first.

This is the specific math and component logic for the **Gauge Chart**. This implementation solves the hardest part of your "Phase 1": translating a data value (0–100) into a rotating SVG needle.

### The Mathematics: "The Unit Circle"

To verify this works, visualizing the math helps:

* **Input**: A value between `0` (Empty) and `100` (Full).
* **Output**: An angle in degrees where `180°` is the start (Left) and `0°` is the end (Right).
* **Coordinate Conversion**:
    * We use standard trigonometry: $x = r \cdot \cos(\theta)$, $y = r \cdot \sin(\theta)$.
    * **Crucial SVG Adjustment**: In SVG, the Y-axis is inverted (0 is at the top). So to go "Up" from the center, we must **subtract** from the Center Y (`cy`).

### The Code: `SentimentGauge.jsx`

Create this file in `src/components/structure/Charts/SentimentGauge/`.

```javascript
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// 1. CONSTANTS & CONFIG
const RADIAN = Math.PI / 180;
const data = [
  { name: 'Score', value: 100, color: '#e5e7eb' }, // Background track (Gray)
];

// 2. THE NEEDLE COMPONENT (Pure Math)
// This is not a Recharts component; it is a custom SVG shape we inject.
const Needle = ({ value, cx, cy, iR, oR, color }) => {
  const total = 100; // Assuming value is 0-100
  // Convert value to angle: 
  // Value 0 -> 180 deg (Left)
  // Value 100 -> 0 deg (Right)
  const angle = 180 - (value / total) * 180;
  
  // Needle Length (slightly shorter than outer radius)
  const length = (iR + 2 * oR) / 3; 

  // Calculate Tip Coordinates
  // Note: We use -sin because SVG Y-axis is inverted (Up is negative)
  const sin = Math.sin(-RADIAN * angle); 
  const cos = Math.cos(-RADIAN * angle);
  
  // The Tip of the needle
  const x0 = cx + length * cos;
  const y0 = cy + length * sin;

  // The Base of the needle (fatter for visibility)
  const xba = cx + 5 * sin;
  const yba = cy - 5 * cos;
  const xbb = cx - 5 * sin;
  const ybb = cy + 5 * cos;

  return (
    <g>
      {/* The Needle Triangle */}
      <path 
        d={`M${xba} ${yba} L${xbb} ${ybb} L${x0} ${y0} Z`} 
        fill={color} 
        stroke="none"
      />
      {/* The Center Pivot Circle */}
      <circle cx={cx} cy={cy} r={8} fill={color} stroke="none" />
    </g>
  );
};

// 3. THE WRAPPER COMPONENT
const SentimentGauge = ({ value = 50, title = "Market Sentiment" }) => {
  // Determine color based on value (Traffic Light Logic)
  const getThemeColor = (val) => {
    if (val < 30) return '#ef4444'; // Red (Fear)
    if (val < 70) return '#eab308'; // Yellow (Neutral)
    return '#22c55e'; // Green (Greed)
  };
  
  const activeColor = getThemeColor(value);

  return (
    <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{ marginBottom: '0', color: '#374151' }}>{title}</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="75%" // Move center down so the semi-circle fills the space
            innerRadius={80}
            outerRadius={120}
            stroke="none"
          >
            {/* Render the background track */}
            <Cell fill="#f3f4f6" />
          </Pie>
          
          {/* This second Pie is the "Colored Bar" that fills up to the value. 
            We overlay it on the gray track. 
          */}
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={180 - (value / 100) * 180} // Dynamic End Angle!
            data={[{ value: value }]}
            cx="50%"
            cy="75%"
            innerRadius={80}
            outerRadius={120}
            stroke="none"
          >
            <Cell fill={activeColor} />
          </Pie>

          {/* Inject Custom Needle */}
          {/* We must use a render prop or custom component to access cx/cy context if needed, 
              but since we hardcoded 50%/75%, we can pass assumed values or let Recharts handle context. 
              However, Recharts doesn't easily pass cx/cy to children outside <Pie>.
              
              TRICK: We can't easily get the calculated pixel cx/cy from ResponsiveContainer 
              without using a Customized component. 
              
              Simplification for POC: Assume standard size or hardcode pixel offsets if container is fixed.
              BETTER WAY: Use the `Customized` API from Recharts.
          */}
           <Needle 
              value={value} 
              cx={250} // ⚠️ NOTE: In a real responsive app, these must be dynamic. See below.
              cy={225} 
              iR={80} 
              oR={120} 
              color="#1f2937" 
           />
        </PieChart>
      </ResponsiveContainer>
      
      {/* The Digital Readout */}
      <div style={{ marginTop: '-40px', fontSize: '24px', fontWeight: 'bold', color: activeColor }}>
        {value}%
      </div>
    </div>
  );
};

export default SentimentGauge;
```

### ⚠ Crucial Fix for Responsiveness (`cx`, `cy`)

In the code above, `cx={250}` is hardcoded, which will break if the window resizes. To make the needle truly responsive (snapping to the center of the chart wherever it is), we must use the **Function-as-Child** pattern of `Pie` or the `Customized` component.

Here is the **Production-Ready** way to inject the needle so it finds the center automatically:

```javascript
/* Replace the <Needle ... /> line in the return statement with this: */

<Pie
  data={data}
  cx="50%"
  cy="75%"
  // ... other props
  labelLine={false}
  label={({ cx, cy, innerRadius, outerRadius }) => {
    // Recharts calculates cx/cy for us and passes them here!
    // We abuse the 'label' prop to render our Needle instead of text.
    return (
      <Needle
        cx={cx}
        cy={cy}
        iR={innerRadius}
        oR={outerRadius}
        value={value}
        color="#1f2937"
      />
    );
  }}
>
  <Cell fill="none" /> {/* Invisible cell just to trigger the label render */}
</Pie>
```

### Next Step

Copy this code into your project.

1.  **Test:** Create a page that renders `<SentimentGauge value={25} />` and `<SentimentGauge value={90} />`.
2.  **Verify:** Does the needle point Left for 25 and Right for 90?
3.  **Refine:** Once this works, we can tackle **Phase 2** (The "Equation Plotter" for Bollinger Bands).

Would you like the code for the **Bollinger Bands Generator (`math-utils.js`)** next?

This is **Phase 3** of your Blueprint: **Global State & Context Architecture**.

In your "Ship Project" screenshots (`Filtros.png`), you have a sidebar that controls *everything*. If you change "Porto" or "Produto", every single chart updates.

We will replicate this in **QuantDash** by building a **Global Filter System**.

* **The Input:** A global "Currency" toggle (USD vs EUR) and "Timeframe" selector (1D, 1W).
* **The Reaction:** The charts will automatically fetch new data or re-calculate values (e.g., converting price to Euro) without you passing props down manually.

-----

### 1\. The Brain: `FilterContext.jsx`

This file holds the "Truth" of your application. It replaces the need to pass `props` from Dashboard -\> Grid -\> Card -\> Chart.

**File:** `src/context/FilterContext.jsx`

```javascript
import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const FilterContext = createContext();

// 2. The Provider Component (Wraps your app)
export const FilterProvider = ({ children }) => {
  // The State of your "Sidebar"
  const [filters, setFilters] = useState({
    currency: 'USD',    // 'USD' or 'EUR'
    timeframe: '1D',    // '1D', '1W', '1M'
    asset: 'BTC'        // 'BTC', 'ETH'
  });

  // Helper to update just one filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

// 3. The Hook (How components consume the data)
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
```

-----

### 2\. The Logic Layer: `useMarketData.js`

This is the most critical pattern for your career. Instead of fetching data inside the component (`useEffect` inside `BollingerChart`), we create a **Custom Hook**.

This hook "listens" to the Context. When the Context changes (e.g., user switches to EUR), this hook automatically re-runs and gives the chart new numbers.

**File:** `src/hooks/useMarketData.js`

```javascript
import { useState, useEffect } from 'react';
import { useFilters } from '../context/FilterContext';
import { generateRandomWalk, calculateBollingerBands } from '../services/math-utils';

export const useMarketData = () => {
  const { filters } = useFilters(); // ⬅️ Auto-subscribes to global state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // SIMULATE API CALL
    // In your real job, this is where you call: 
    // fetch(`/api/ships?port=${filters.port}&product=${filters.product}`)
    
    setTimeout(() => {
      // 1. Generate Base Data (simulating raw API response)
      const steps = filters.timeframe === '1D' ? 24 : 168; // 24 hours vs 168 hours
      const rawData = generateRandomWalk(100, steps);

      // 2. Apply "Business Logic" (Currency Conversion)
      const currencyMultiplier = filters.currency === 'EUR' ? 0.85 : 1;
      
      const convertedData = rawData.map(d => ({
        ...d,
        price: d.price * currencyMultiplier
      }));

      // 3. Apply "Math Logic" (Bollinger Bands)
      const finalData = calculateBollingerBands(convertedData, 5);

      setData(finalData);
      setLoading(false);
    }, 600); // Fake network delay

  }, [filters]); // ⬅️ CRITICAL: Re-run whenever 'filters' change

  return { data, loading, filters };
};
```

-----

### 3\. The Dashboard Integration

Now we wire it all together. Notice how `Dashboard.jsx` is now **cleaner**. It doesn't calculate math; it just renders the layout.

**File:** `src/pages/Dashboard.jsx` (Updated)

```javascript
import React from 'react';
import BollingerChart from '../components/structure/Charts/BollingerChart/BollingerChart';
import SentimentGauge from '../components/structure/Charts/SentimentGauge/SentimentGauge';
import { useMarketData } from '../hooks/useMarketData';
import { useFilters } from '../context/FilterContext';

// A simple UI component for the "Sidebar/TopBar" controls
const DashboardControls = () => {
  const { filters, updateFilter } = useFilters();

  return (
    <div style={{ padding: '20px', background: 'white', marginBottom: '20px', borderRadius: '8px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      {/* Currency Toggle */}
      <div>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Currency:</label>
        <select 
          value={filters.currency} 
          onChange={(e) => updateFilter('currency', e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      {/* Timeframe Toggle */}
      <div>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Range:</label>
        <button 
          onClick={() => updateFilter('timeframe', '1D')}
          style={{ 
            background: filters.timeframe === '1D' ? '#2563eb' : '#e5e7eb',
            color: filters.timeframe === '1D' ? 'white' : 'black',
            padding: '5px 15px', border: 'none', marginRight: '5px', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          1 Day
        </button>
        <button 
          onClick={() => updateFilter('timeframe', '1W')}
          style={{ 
            background: filters.timeframe === '1W' ? '#2563eb' : '#e5e7eb',
            color: filters.timeframe === '1W' ? 'white' : 'black',
            padding: '5px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          1 Week
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // The Dashboard doesn't know about math. It just asks the hook.
  const { data, loading, filters } = useMarketData();

  return (
    <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>QuantDash Command Center</h1>
      
      {/* The Global Controls */}
      <DashboardControls />

      {loading ? (
        <div>Loading Analysis...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* Gauge Widget */}
          <SentimentGauge 
            value={filters.currency === 'EUR' ? 65 : 82} // Fake dynamic change
            title={`Market Sentiment (${filters.asset})`} 
          />
          
          {/* Bollinger Widget */}
          <BollingerChart 
            data={data} 
            title={`Volatility Analysis - ${filters.asset} (${filters.currency})`} 
          />
          
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

### 4\. How to Initialize the App

For the Context to work, you must wrap your entire application in `App.jsx` (or `main.jsx`).

```javascript
// src/App.jsx
import React from 'react';
import Dashboard from './pages/Dashboard';
import { FilterProvider } from './context/FilterContext';

const App = () => {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
};

export default App;
```

-----

### What have you just built?

1.  **State Abstraction:** The `Dashboard` component no longer calculates standard deviation. It is "dumb." This is good architecture.
2.  **Reactive Data:** Changing "USD" to "EUR" triggers a cascade: `Context Update` -\> `Hook Re-run` -\> `Math Recalculation` -\> `Chart Re-render`.
3.  **Ship Project Readiness:** When you get to your real job, replace `currency` with `portName` and `generateRandomWalk` with `axios.get('/api/ships')`. The architecture remains **identical**.

### Next Step: Phase 4 (The Drag & Drop Layout)

You now have the **Data** and **Visuals**. The final missing piece from your requirements is the **"Widget Ordering"** (`Ordenação.png`).

Do you want to implement the **Widget Registry & Drag-and-Drop** system now?

This is **Phase 4** of the Blueprint: **Dynamic Layouts & Drag-and-Drop**.

In your specific requirement (`Ordenação.png`), the user does not drag the giant charts themselves. Instead, they open a **Modal/Sidebar** with a list of items ("1º Nome do gráfico", "2º ..."), reorder that list, and the Dashboard updates.

We will replicate this exact pattern.

-----

### 1\. The Strategy: "The Registry Pattern"

To reorder components dynamically, you cannot hardcode them like `<ChartA /> <ChartB />`. You need a **Lookup Map** (Registry).

**File:** `src/config/widgetRegistry.js`

```javascript
import SentimentGauge from '../components/structure/Charts/SentimentGauge/SentimentGauge';
import BollingerChart from '../components/structure/Charts/BollingerChart/BollingerChart';
// Import other charts here...

// The Registry maps a string ID to the Component and its Default Props
export const WIDGET_REGISTRY = {
  'sentiment_gauge': {
    id: 'sentiment_gauge',
    title: 'Market Sentiment',
    component: SentimentGauge, 
    defaultProps: { value: 65 } // Default mock data
  },
  'bollinger_band': {
    id: 'bollinger_band',
    title: 'Volatility Analysis',
    component: BollingerChart,
    defaultProps: { data: [] } // Data will be injected by the page
  },
  'rsi_chart': {
    id: 'rsi_chart',
    title: 'Relative Strength (RSI)',
    component: () => <div style={{height: 200, background: '#e5e7eb'}}>Placeholder RSI</div>,
    defaultProps: {}
  }
};
```

-----

### 2\. The Logic: "The Sortable List"

We need a component that renders the list shown in `Ordenação.png`. We will use **`@dnd-kit`** because it is lightweight and accessible.

**Install:** `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**File:** `src/components/layout/LayoutEditor.jsx`

```javascript
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 1. The Individual Draggable Row
const SortableItem = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '12px',
    marginBottom: '8px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ fontWeight: 500 }}>{title}</span>
      {/* The "Drag Handle" Icon (Hamburger menu style) */}
      <span style={{ color: '#9ca3af' }}>☰</span>
    </div>
  );
};

// 2. The Editor Container (The "Modal" Content)
const LayoutEditor = ({ items, onReorder }) => {
  // items = ['sentiment_gauge', 'bollinger_band']
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      // Reorder the array
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#6b7280' }}>
            Widget Order
          </h4>
          {items.map((id) => (
             // We pass the ID, but look up the Title from the Registry for display
             <SortableItem key={id} id={id} title={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default LayoutEditor;
```

-----

### 3\. The Grand Integration: `Dashboard.jsx`

We update the Dashboard to maintain the `widgetOrder` state. This state determines **which** components render and in **what order**.

**File:** `src/pages/Dashboard.jsx` (Final Version)

```javascript
import React, { useState } from 'react';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import LayoutEditor from '../components/layout/LayoutEditor';
import { useMarketData } from '../hooks/useMarketData';
// ... import other components

const Dashboard = () => {
  // 1. Data Logic (From Phase 3)
  const { data, loading, filters } = useMarketData();

  // 2. Layout State (The list of active widget IDs)
  // In a real app, this initial state comes from LocalStorage or API
  const [widgetOrder, setWidgetOrder] = useState([
    'sentiment_gauge', 
    'bollinger_band',
    'rsi_chart'
  ]);

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>QuantDash Command Center</h1>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          style={{ background: '#4b5563', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isEditMode ? 'Close Editor' : 'Customize Layout'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isEditMode ? '3fr 1fr' : '1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: THE CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignContent: 'start' }}>
          {widgetOrder.map((widgetId) => {
            const config = WIDGET_REGISTRY[widgetId];
            if (!config) return null;
            
            const WidgetComponent = config.component;

            // Inject props dynamically based on the widget type
            // In a real app, you might have a specialized mapping function here
            let dynamicProps = {};
            if (widgetId === 'bollinger_band') dynamicProps = { data: data };
            if (widgetId === 'sentiment_gauge') dynamicProps = { value: filters.currency === 'EUR' ? 65 : 82 };

            return (
              <div key={widgetId} style={{ gridColumn: widgetId === 'bollinger_band' ? 'span 2' : 'span 1' }}>
                 {/* This is the "Map & Render" pattern. 
                    The Dashboard doesn't know what it's rendering, it just renders what's in the list.
                 */}
                 <WidgetComponent {...config.defaultProps} {...dynamicProps} />
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: THE EDITOR (Only visible in Edit Mode) */}
        {isEditMode && (
          <div style={{ height: 'fit-content' }}>
            <LayoutEditor 
              items={widgetOrder} 
              onReorder={setWidgetOrder} // Pass the state setter directly
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
```

-----

### Final Project Checklist

You now have a complete generic architecture that trains you for 90% of your upcoming job tasks:

1.  **Rendering Custom Viz:** `SentimentGauge` (SVG Manipulation).
2.  **Complex Data Math:** `BollingerChart` (Data overlay & derived state).
3.  **Global Filters:** `FilterContext` (Sidebar driving all charts).
4.  **User Customization:** `LayoutEditor` (Dynamic Registry & Reordering).

### Recommended Next Step (Self-Study)

Before your first day at work, spend 1 hour doing this:
**"Break the Layout."**
Try to add a new widget (e.g., a simple HTML table) to `widgetRegistry.js` *without touching the Dashboard code*.
If you can make a new widget appear just by editing the registry and the sortable list, you have mastered the **Open-Closed Principle** (Open for extension, closed for modification), which is the holy grail of React architecture.

This is **Phase 4** of the Blueprint: **Dynamic Layouts & Drag-and-Drop**.

In your specific requirement (`Ordenação.png`), the user does not drag the giant charts themselves. Instead, they open a **Modal/Sidebar** with a list of items ("1º Nome do gráfico", "2º ..."), reorder that list, and the Dashboard updates.

We will replicate this exact pattern.

-----

### 1\. The Strategy: "The Registry Pattern"

To reorder components dynamically, you cannot hardcode them like `<ChartA /> <ChartB />`. You need a **Lookup Map** (Registry).

**File:** `src/config/widgetRegistry.js`

```javascript
import SentimentGauge from '../components/structure/Charts/SentimentGauge/SentimentGauge';
import BollingerChart from '../components/structure/Charts/BollingerChart/BollingerChart';
// Import other charts here...

// The Registry maps a string ID to the Component and its Default Props
export const WIDGET_REGISTRY = {
  'sentiment_gauge': {
    id: 'sentiment_gauge',
    title: 'Market Sentiment',
    component: SentimentGauge, 
    defaultProps: { value: 65 } // Default mock data
  },
  'bollinger_band': {
    id: 'bollinger_band',
    title: 'Volatility Analysis',
    component: BollingerChart,
    defaultProps: { data: [] } // Data will be injected by the page
  },
  'rsi_chart': {
    id: 'rsi_chart',
    title: 'Relative Strength (RSI)',
    component: () => <div style={{height: 200, background: '#e5e7eb'}}>Placeholder RSI</div>,
    defaultProps: {}
  }
};
```

-----

### 2\. The Logic: "The Sortable List"

We need a component that renders the list shown in `Ordenação.png`. We will use **`@dnd-kit`** because it is lightweight and accessible.

**Install:** `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**File:** `src/components/layout/LayoutEditor.jsx`

```javascript
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 1. The Individual Draggable Row
const SortableItem = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '12px',
    marginBottom: '8px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ fontWeight: 500 }}>{title}</span>
      {/* The "Drag Handle" Icon (Hamburger menu style) */}
      <span style={{ color: '#9ca3af' }}>☰</span>
    </div>
  );
};

// 2. The Editor Container (The "Modal" Content)
const LayoutEditor = ({ items, onReorder }) => {
  // items = ['sentiment_gauge', 'bollinger_band']
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      // Reorder the array
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#6b7280' }}>
            Widget Order
          </h4>
          {items.map((id) => (
             // We pass the ID, but look up the Title from the Registry for display
             <SortableItem key={id} id={id} title={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default LayoutEditor;
```

-----

### 3\. The Grand Integration: `Dashboard.jsx`

We update the Dashboard to maintain the `widgetOrder` state. This state determines **which** components render and in **what order**.

**File:** `src/pages/Dashboard.jsx` (Final Version)

```javascript
import React, { useState } from 'react';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import LayoutEditor from '../components/layout/LayoutEditor';
import { useMarketData } from '../hooks/useMarketData';
// ... import other components

const Dashboard = () => {
  // 1. Data Logic (From Phase 3)
  const { data, loading, filters } = useMarketData();

  // 2. Layout State (The list of active widget IDs)
  // In a real app, this initial state comes from LocalStorage or API
  const [widgetOrder, setWidgetOrder] = useState([
    'sentiment_gauge', 
    'bollinger_band',
    'rsi_chart'
  ]);

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>QuantDash Command Center</h1>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          style={{ background: '#4b5563', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isEditMode ? 'Close Editor' : 'Customize Layout'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isEditMode ? '3fr 1fr' : '1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: THE CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignContent: 'start' }}>
          {widgetOrder.map((widgetId) => {
            const config = WIDGET_REGISTRY[widgetId];
            if (!config) return null;
            
            const WidgetComponent = config.component;

            // Inject props dynamically based on the widget type
            // In a real app, you might have a specialized mapping function here
            let dynamicProps = {};
            if (widgetId === 'bollinger_band') dynamicProps = { data: data };
            if (widgetId === 'sentiment_gauge') dynamicProps = { value: filters.currency === 'EUR' ? 65 : 82 };

            return (
              <div key={widgetId} style={{ gridColumn: widgetId === 'bollinger_band' ? 'span 2' : 'span 1' }}>
                 {/* This is the "Map & Render" pattern. 
                    The Dashboard doesn't know what it's rendering, it just renders what's in the list.
                 */}
                 <WidgetComponent {...config.defaultProps} {...dynamicProps} />
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: THE EDITOR (Only visible in Edit Mode) */}
        {isEditMode && (
          <div style={{ height: 'fit-content' }}>
            <LayoutEditor 
              items={widgetOrder} 
              onReorder={setWidgetOrder} // Pass the state setter directly
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
```

-----

### Final Project Checklist

You now have a complete generic architecture that trains you for 90% of your upcoming job tasks:

1.  **Rendering Custom Viz:** `SentimentGauge` (SVG Manipulation).
2.  **Complex Data Math:** `BollingerChart` (Data overlay & derived state).
3.  **Global Filters:** `FilterContext` (Sidebar driving all charts).
4.  **User Customization:** `LayoutEditor` (Dynamic Registry & Reordering).

### Recommended Next Step (Self-Study)

Before your first day at work, spend 1 hour doing this:
**"Break the Layout."**
Try to add a new widget (e.g., a simple HTML table) to `widgetRegistry.js` *without touching the Dashboard code*.
If you can make a new widget appear just by editing the registry and the sortable list, you have mastered the **Open-Closed Principle** (Open for extension, closed for modification), which is the holy grail of React architecture.

