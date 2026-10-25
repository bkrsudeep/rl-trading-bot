import React from 'react';
import { 
  Server, 
  Cpu, 
  Sparkles, 
  Settings2, 
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Header({ 
  backendStatus, 
  isDemoMode, 
  setIsDemoMode, 
  onOpenSettings, 
  onCheckHealth,
  isCheckingHealth 
}) {
  return (
    <header className="top-header">
      {/* Title & Subtitle */}
      <div>
        <h1 style={{ 
          fontSize: '16px', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Intelligent Stock Trading Bot
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            background: 'rgba(20, 184, 166, 0.15)',
            color: 'var(--teal-400)',
            border: '1px solid var(--border-teal)',
            padding: '2px 8px',
            borderRadius: '9999px'
          }}>
            RL + LSTM State Modeling
          </span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Sequential Feature Extraction via LSTM & Policy Optimization via Deep Q-Network (DQN)
        </p>
      </div>

      {/* Control Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Dataset Disclosure Badge */}
        <div className="badge badge-synthetic" title="Trained on synthetic demonstration data. Not live market data.">
          <Database size={12} />
          <span>Synthetic Demo Data</span>
        </div>

        {/* Backend Status Chip */}
        <div 
          onClick={onOpenSettings}
          style={{
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            transition: 'background 0.15s ease'
          }}
          title="Click to configure backend API URL"
        >
          <span className={`status-dot ${backendStatus.connected ? 'online' : isDemoMode ? 'demo' : 'offline'}`} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {backendStatus.connected ? 'API Connected' : isDemoMode ? 'Demo Mode' : 'API Offline'}
          </span>
          <Settings2 size={13} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Mode Switcher: Live Backend vs Demo Mode */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setIsDemoMode(true)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: isDemoMode ? 600 : 400,
              borderRadius: '5px',
              border: 'none',
              background: isDemoMode ? 'var(--teal-500)' : 'transparent',
              color: isDemoMode ? '#041B15' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={12} />
            Demo Mode
          </button>
          <button
            onClick={() => setIsDemoMode(false)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: !isDemoMode ? 600 : 400,
              borderRadius: '5px',
              border: 'none',
              background: !isDemoMode ? 'var(--teal-500)' : 'transparent',
              color: !isDemoMode ? '#041B15' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            <Server size={12} />
            FastAPI Backend
          </button>
        </div>

        {/* Refresh health check button */}
        <button
          onClick={onCheckHealth}
          disabled={isCheckingHealth}
          className="btn btn-secondary btn-sm"
          title="Check backend health"
          style={{ padding: '6px 10px' }}
        >
          <RefreshCw size={13} className={isCheckingHealth ? 'spin' : ''} />
        </button>
      </div>
    </header>
  );
}
