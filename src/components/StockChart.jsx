import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Database, Activity } from 'lucide-react';
import { STOCK_METADATA, SYNTHETIC_STOCK_SERIES } from '../data/demoData';
import { formatINR } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        fontSize: '12px'
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{data.date}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Close:</span>
          <span className="mono" style={{ color: 'var(--teal-400)', fontWeight: 600 }}>
            {formatINR(data.close)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>20-Day MA:</span>
          <span className="mono" style={{ color: '#94A3B8' }}>
            {formatINR(data.ma20)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Volume:</span>
          <span className="mono" style={{ color: 'var(--text-muted)' }}>
            {(data.volume / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function StockChart() {
  const [timeRange, setTimeRange] = useState('ALL');

  // Filter series based on time range
  const filteredData = React.useMemo(() => {
    if (timeRange === '1W') return SYNTHETIC_STOCK_SERIES.slice(-5);
    if (timeRange === '1M') return SYNTHETIC_STOCK_SERIES.slice(-15);
    return SYNTHETIC_STOCK_SERIES;
  }, [timeRange]);

  const minPrice = Math.min(...filteredData.map(d => d.close)) * 0.98;
  const maxPrice = Math.max(...filteredData.map(d => d.close)) * 1.02;

  return (
    <div className="card">
      {/* Header Info */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="card-title" style={{ fontSize: '18px' }}>
              {STOCK_METADATA.name}
            </h2>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              {STOCK_METADATA.symbol}
            </span>
            <span className="badge badge-synthetic">
              <Database size={11} />
              DEMO / SYNTHETIC
            </span>
          </div>
          <div className="card-subtitle" style={{ marginTop: '4px' }}>
            {STOCK_METADATA.exchange} • Currency: {STOCK_METADATA.currency} • Model Focus Asset
          </div>
        </div>

        {/* Time Range Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {['1W', '1M', 'ALL'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: timeRange === range ? 600 : 400,
                borderRadius: '5px',
                border: '1px solid',
                borderColor: timeRange === range ? 'var(--teal-500)' : 'var(--border-subtle)',
                background: timeRange === range ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                color: timeRange === range ? 'var(--teal-400)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Current Quote Highlight Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        gap: '16px', 
        paddingBottom: '16px', 
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <div className="mono" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {formatINR(STOCK_METADATA.currentPrice)}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          color: 'var(--signal-buy)',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <TrendingUp size={16} />
          +{formatINR(STOCK_METADATA.dayChange)} (+{STOCK_METADATA.dayChangePercent}%)
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          52W Range: <span className="mono" style={{ color: 'var(--text-secondary)' }}>₹2,220.30 - ₹3,024.90</span> • Volume: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{STOCK_METADATA.volume24h}</span>
        </div>
      </div>

      {/* Main Interactive Recharts Area Chart */}
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickFormatter={(val) => val.split('-').slice(1).join('/')}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              orientation="right"
              tickFormatter={(val) => `₹${Math.round(val)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#14B8A6" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#priceGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Sub-Chart */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Trading Volume (Shares)</span>
          <span>Sample Synthetic Sequence</span>
        </div>
        <div style={{ width: '100%', height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <Bar dataKey="volume" fill="rgba(20, 184, 166, 0.3)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer Strip */}
      <div style={{ 
        marginTop: '14px', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Market series generated synthetically to train and evaluate the LSTM-DQN agent.</span>
        <span style={{ color: 'var(--teal-400)', fontWeight: 500 }}>Unvalidated on live NSE tick feed</span>
      </div>
    </div>
  );
}
