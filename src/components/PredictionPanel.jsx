import React from 'react';
import { 
  Play, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Server, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PauseCircle
} from 'lucide-react';

export default function PredictionPanel({ 
  currentPrediction, 
  isLoading, 
  apiError, 
  onGeneratePrediction, 
  isDemoMode, 
  setIsDemoMode,
  featuresWindow,
  onExecuteTradeWithSignal,
  portfolioCash
}) {
  const hasPrediction = currentPrediction !== null;
  const action = currentPrediction?.action || 'NO PREDICTION';
  const actionCode = currentPrediction?.actionCode ?? null;
  const isDemo = currentPrediction?.isSimulated || isDemoMode;
  const qValues = currentPrediction?.qValues;

  const getSignalIcon = (act) => {
    switch (act) {
      case 'BUY':
        return <TrendingUp size={28} />;
      case 'SELL':
        return <TrendingDown size={28} />;
      case 'HOLD':
      default:
        return <PauseCircle size={28} />;
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="card-title">
            <Cpu size={18} style={{ color: 'var(--teal-400)' }} />
            AI Trading Signal Engine
          </h2>
          <p className="card-subtitle">
            DQN Policy Output from LSTM Latent State Space
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDemoMode ? (
            <span className="badge badge-demo">
              <Sparkles size={11} />
              Simulated Mode
            </span>
          ) : (
            <span className="badge badge-live">
              <Server size={11} />
              FastAPI Endpoint
            </span>
          )}
        </div>
      </div>

      {/* API Error Box with explicit Fallback Button */}
      {apiError && !isDemoMode && (
        <div className="alert-box alert-danger">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>Model Inference Failed</div>
            <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '8px' }}>
              {apiError}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={onGeneratePrediction}
                className="btn btn-secondary btn-sm"
                disabled={isLoading}
              >
                <RefreshCw size={12} className={isLoading ? 'spin' : ''} />
                Retry Backend
              </button>
              <button 
                onClick={() => {
                  setIsDemoMode(true);
                  setTimeout(() => onGeneratePrediction(), 50);
                }}
                className="btn btn-primary btn-sm"
              >
                <Sparkles size={12} />
                Switch to Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signal Output Display */}
      <div style={{
        padding: '24px 20px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '170px',
        textAlign: 'center'
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(20, 184, 166, 0.2)',
              borderTopColor: 'var(--teal-400)',
              borderRadius: '50%',
              animation: 'spin 1s infinite linear'
            }} />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isDemoMode ? 'Simulating DQN forward pass...' : 'Querying Render FastAPI /predict endpoint...'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Processing 10-step market tensor window...
            </div>
          </div>
        ) : hasPrediction ? (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Model Action Recommendation
            </div>
            <div className={`signal-badge-lg signal-${action}`} style={{ marginBottom: '12px', minWidth: '180px' }}>
              {getSignalIcon(action)}
              <span>{action}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>
                Action Code: <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{actionCode}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  ({actionCode === 0 ? 'HOLD' : actionCode === 1 ? 'BUY' : 'SELL'})
                </span>
              </div>
              <span>•</span>
              <div>
                Source: <span style={{ color: isDemo ? 'var(--teal-400)' : '#10B981', fontWeight: 500 }}>
                  {isDemo ? 'Demo Heuristic Simulation' : 'Live Render FastAPI'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Generated at: <span className="mono">{new Date(currentPrediction.timestamp).toLocaleTimeString()}</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={32} style={{ color: 'var(--text-muted)' }} />
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              No Prediction Generated Yet
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px' }}>
              Click below to send the 10x2 tensor window to the LSTM-DQN agent.
            </div>
          </div>
        )}
      </div>

      {/* Raw Q-Values Breakdown (Only displayed when available from backend or demo mode) */}
      {qValues && (
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Raw Deep Q-Values Q(s, a)
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {isDemo ? 'Simulated Q-Values (Demo)' : 'FastAPI Model Output'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'HOLD [0]', val: qValues.HOLD ?? qValues[0] ?? 0, act: 'HOLD', color: 'var(--signal-hold)' },
              { label: 'BUY [1]', val: qValues.BUY ?? qValues[1] ?? 0, act: 'BUY', color: 'var(--signal-buy)' },
              { label: 'SELL [2]', val: qValues.SELL ?? qValues[2] ?? 0, act: 'SELL', color: 'var(--signal-sell)' }
            ].map(item => (
              <div 
                key={item.label}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: action === item.act ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.2)',
                  border: action === item.act ? `1px solid ${item.color}` : '1px solid transparent',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  {item.label}
                </div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>
                  {typeof item.val === 'number' ? item.val.toFixed(3) : item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Strip */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onGeneratePrediction}
          disabled={isLoading}
          className="btn btn-primary"
          style={{ flex: 1, padding: '12px 18px', fontSize: '14px' }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="spin" />
              Computing Policy...
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Generate Prediction
            </>
          )}
        </button>

        {hasPrediction && action !== 'HOLD' && (
          <button
            onClick={() => onExecuteTradeWithSignal(action)}
            className={`btn ${action === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
            style={{ padding: '12px 16px', fontSize: '13px' }}
            title={`Simulate 1-share paper trade based on ${action} signal`}
          >
            Execute {action} in Paper Portfolio
          </button>
        )}
      </div>

      {/* Academic Disclosures */}
      <div style={{ 
        fontSize: '11px', 
        color: 'var(--text-muted)', 
        borderTop: '1px solid var(--border-subtle)', 
        paddingTop: '10px',
        lineHeight: '1.4'
      }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Note on Model Policy: </span>
        The agent selects <span className="mono">arg max Q(s, a)</span> over the state vector synthesized by the LSTM layer. This is an engineering demonstration, not investment advice.
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s infinite linear;
        }
      `}</style>
    </div>
  );
}
