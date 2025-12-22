import SentimentGauge from '@/components/structure/Charts/SentimentGauge/SentimentGauge';
import BollingerChart from '@/components/structure/Charts/BollingerChart/BollingerChart';
import RSIChart from '@/components/structure/Charts/RSIChart/RSIChart';
import LineBarAreaDemo from '@/pages/Demo/LineBarAreaDemo';

// Central registry that lets dashboard layouts reference widgets by ID.
export const WIDGET_REGISTRY = {
  sentiment_gauge: {
    id: 'sentiment_gauge',
    title: 'Market Sentiment',
    component: SentimentGauge,
    defaultProps: { value: 65 },
  },
  bollinger_band: {
    id: 'bollinger_band',
    title: 'Volatility Analysis',
    component: BollingerChart,
    defaultProps: { data: [] },
  },
  rsi_chart: {
    id: 'rsi_chart',
    title: 'Relative Strength (RSI)',
    component: RSIChart,
    defaultProps: { data: [] },
  },
  line_bar_area_demo: {
    id: 'line_bar_area_demo',
    title: 'Engine Performance Demo',
    component: LineBarAreaDemo,
    defaultProps: {},
  },
};
