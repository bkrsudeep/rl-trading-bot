import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue, 
  badge,
  valueColor
}) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--teal-400)'
          }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
        <span className="mono" style={{ 
          fontSize: '22px', 
          fontWeight: 700, 
          color: valueColor || 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          {value}
        </span>
        {badge && (
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '4px',
            background: badge.bg || 'rgba(20, 184, 166, 0.1)',
            color: badge.color || 'var(--teal-400)',
            border: `1px solid ${badge.border || 'var(--border-teal)'}`
          }}>
            {badge.label}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
        {trend && (
          <span style={{
            color: trend === 'up' ? 'var(--signal-buy)' : trend === 'down' ? 'var(--signal-sell)' : 'var(--text-muted)',
            fontWeight: 600
          }}>
            {trendValue}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
