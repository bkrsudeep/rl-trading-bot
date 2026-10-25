import React from 'react';
import { Activity, Clock, Trash2, Cpu, Sparkles, Server } from 'lucide-react';

export default function ActivityTable({ predictionHistory, onClearHistory }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Activity size={18} style={{ color: 'var(--teal-400)' }} />
            Session Prediction Activity Log
          </h2>
          <p className="card-subtitle">
            Chronological audit log of all model policy evaluations during this browser session
          </p>
        </div>

        {predictionHistory.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--text-muted)' }}
            title="Clear browser session activity log"
          >
            <Trash2 size={13} />
            Clear Log
          </button>
        )}
      </div>

      {predictionHistory.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px dashed var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Clock size={32} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            No Predictions Generated in This Session
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '340px' }}>
            Load a sample sequence in the LSTM Input tab and click "Generate Prediction" to log model outputs.
          </div>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Timestamp</th>
                <th>Signal Action</th>
                <th>Action Code</th>
                <th>Model Source</th>
                <th>Tensor Input Window</th>
                <th>Raw Q-Values (if provided)</th>
                <th>Inference Status</th>
              </tr>
            </thead>
            <tbody>
              {predictionHistory.map((item, index) => {
                const isBuy = item.action === 'BUY';
                const isSell = item.action === 'SELL';
                const isDemo = item.isSimulated || item.source === 'demo_simulation';

                return (
                  <tr key={index}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      #{predictionHistory.length - index}
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td>
                      <span className={`badge ${isBuy ? 'badge-live' : isSell ? 'badge-disconnected' : 'badge-synthetic'}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>
                      {item.actionCode}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isDemo ? (
                          <>
                            <Sparkles size={12} style={{ color: 'var(--teal-400)' }} />
                            <span style={{ color: 'var(--teal-400)' }}>Demo Simulator</span>
                          </>
                        ) : (
                          <>
                            <Server size={12} style={{ color: '#10B981' }} />
                            <span style={{ color: '#10B981' }}>FastAPI Endpoint</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.windowPresetName || '10×2 Window Tensor'}
                    </td>
                    <td className="mono" style={{ fontSize: '11px' }}>
                      {item.qValues ? (
                        <span>
                          H:{item.qValues.HOLD ?? item.qValues[0] ?? '-'} • 
                          B:{item.qValues.BUY ?? item.qValues[1] ?? '-'} • 
                          S:{item.qValues.SELL ?? item.qValues[2] ?? '-'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Not Returned</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-connected" style={{ fontSize: '10px' }}>
                        {item.status || 'Success'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
        * Records are maintained in client browser memory for the current session only.
      </div>
    </div>
  );
}
