import SentimentGauge from '../components/structure/Charts/SentimentGauge/SentimentGauge';
import BollingerChart from '../components/structure/Charts/BollingerChart/BollingerChart';

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
        // Inline placeholder for now, as we didn't implement specialized RSI yet
        component: () => (
            <div style={{
                width: '100%',
                height: 200,
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#9ca3af',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h4>RSI Chart (Coming Soon)</h4>
            </div>
        ),
        defaultProps: {}
    }
};
