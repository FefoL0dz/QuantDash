import SentimentGauge from '../components/structure/Charts/SentimentGauge/SentimentGauge';
import BollingerChart from '../components/structure/Charts/BollingerChart/BollingerChart';
import RSIChart from '../components/structure/Charts/RSIChart/RSIChart';

// The Registry maps a string ID to the Component and its Default Props
export const WIDGET_REGISTRY = {
    'sentiment_gauge': {
        id: 'sentiment_gauge',
        title: 'Market Sentiment',
        component: SentimentGauge,
        defaultProps: { value: 65 } // Default mock data if no dynamic props override
    },
    'bollinger_band': {
        id: 'bollinger_band',
        title: 'Volatility Analysis',
        component: BollingerChart,
        defaultProps: { data: [] }
    },
    'rsi_chart': {
        id: 'rsi_chart',
        title: 'Relative Strength (RSI)',
        component: RSIChart,
        defaultProps: { data: [] }
    }
};
