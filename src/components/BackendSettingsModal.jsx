import React, { useState } from 'react';
import { 
  X, 
  Server, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth } from '../services/api';

export default function BackendSettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [urlInput, setUrlInput] = useState(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const targetUrl = urlInput.trim();
    if (!targetUrl) {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: 'Please enter a valid URL (e.g., https://your-backend.onrender.com or http://127.0.0.1:8000)'
      });
      return;
    }

    const health = await checkBackendHealth(targetUrl);
    setIsTesting(false);
    if (health.connected) {
      setTestResult({
        success: true,
        message: `Connected successfully! (GET / returned HTTP 200)`
      });
    } else {
      setTestResult({
        success: false,
        message: health.message || 'Unable to reach backend endpoint.'
      });
    }
  };

  const handleSave = () => {
    setApiBaseUrl(urlInput.trim());
    onSettingsUpdated();
    onClose();
  };

  const handleResetToDemo = () => {
    setUrlInput('');
    setApiBaseUrl('');
    setTestResult(null);
    onSettingsUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} style={{ color: 'var(--teal-400)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              FastAPI Backend Configuration
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
          Enter the URL of your deployed Render FastAPI service or local backend. When empty or unreachable, the dashboard operates seamlessly in <strong>Local Demo Mode</strong>.
        </p>

        {/* Input Field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            FastAPI Base URL
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              placeholder="https://your-service.onrender.com or http://127.0.0.1:8000"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestResult(null);
              }}
              className="input-field mono"
              style={{ flex: 1, fontSize: '12px' }}
            />
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="btn btn-secondary btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              {isTesting ? <RefreshCw size={13} className="spin" /> : <Globe size={13} />}
              Test Ping
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Will test <span className="mono">GET /</span> and send predictions to <span className="mono">POST /predict</span>.
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className={`alert-box ${testResult.success ? 'alert-info' : 'alert-danger'}`} style={{ marginBottom: '16px' }}>
            {testResult.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Render Free Tier Info Notice */}
        <div style={{ 
          padding: '10px 12px', 
          borderRadius: '6px', 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <Info size={14} style={{ color: 'var(--teal-400)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Render Free Tier Note:</strong> If your Render web service has been idle, it spins down and may require 45–60 seconds to cold start on the first ping.
          </span>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleResetToDemo}
            className="btn btn-secondary btn-sm"
            style={{ color: '#F43F5E' }}
          >
            Clear URL (Use Demo Mode)
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
