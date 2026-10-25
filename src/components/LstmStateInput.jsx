import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Info
} from 'lucide-react';
import { SAMPLE_FEATURE_WINDOWS } from '../data/demoData';
import { parseCSVToFeaturesWindow, formatINR } from '../services/api';

export default function LstmStateInput({ 
  featuresWindow, 
  setFeaturesWindow, 
  selectedPreset, 
  setSelectedPreset 
}) {
  const [csvError, setCsvError] = useState(null);
  const [csvSuccess, setCsvSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Validate the tensor structure
  const isValidShape = Array.isArray(featuresWindow) && 
    featuresWindow.length === 10 && 
    featuresWindow.every(row => Array.isArray(row) && row.length === 2 && !isNaN(row[0]) && !isNaN(row[1]));

  const handlePresetSelect = (presetKey) => {
    const preset = SAMPLE_FEATURE_WINDOWS[presetKey];
    if (preset) {
      setSelectedPreset(presetKey);
      setFeaturesWindow(JSON.parse(JSON.stringify(preset.data)));
      setCsvError(null);
      setCsvSuccess(`Loaded preset: ${preset.name}`);
    }
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const num = parseFloat(value);
    const updated = featuresWindow.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = isNaN(num) ? 0 : num;
        return newRow;
      }
      return row;
    });
    setFeaturesWindow(updated);
    setSelectedPreset('custom');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsedWindow = parseCSVToFeaturesWindow(text);
        setFeaturesWindow(parsedWindow);
        setSelectedPreset('csv_upload');
        setCsvError(null);
        setCsvSuccess(`Successfully parsed ${file.name}: Extracted latest 10 sequential time steps.`);
      } catch (err) {
        setCsvError(err.message || 'Failed to parse CSV file.');
        setCsvSuccess(null);
      }
    };
    reader.onerror = () => {
      setCsvError('Failed to read file.');
      setCsvSuccess(null);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Layers size={18} style={{ color: 'var(--teal-400)' }} />
            LSTM Input State Window Tensor (10, 2)
          </h2>
          <p className="card-subtitle">
            Temporal observations: 10 sequential time steps × 2 features [Close Price (₹), Volume]
          </p>
        </div>

        {/* Validation Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isValidShape ? (
            <span className="badge badge-connected" style={{ padding: '4px 10px' }}>
              <CheckCircle size={13} />
              Tensor Valid (10 × 2)
            </span>
          ) : (
            <span className="badge badge-disconnected" style={{ padding: '4px 10px' }}>
              <AlertCircle size={13} />
              Invalid Tensor Shape
            </span>
          )}
        </div>
      </div>

      {/* Educational Callout explaining the (10, 2) tensor */}
      <div className="alert-box alert-info" style={{ marginBottom: '16px' }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px' }}>
          <strong>Why a 10×2 Window?</strong> Recurrent Neural Networks (LSTM) process <em>sequential</em> dynamics over time. 
          A single stock price cannot reveal velocity, momentum, or volume accumulation. The model therefore expects a sliding window of 10 continuous market periods to encode the state space for the DQN agent.
        </div>
      </div>

      {/* Preset Selector Buttons */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Select Pre-configured Market Sequence:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {Object.entries(SAMPLE_FEATURE_WINDOWS).map(([key, preset]) => {
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className="btn btn-secondary"
                style={{
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderColor: isSelected ? 'var(--teal-500)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(20, 184, 166, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? 'var(--teal-400)' : 'var(--text-secondary)'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--teal-400)' : 'var(--text-primary)' }}>
                    {preset.name.split('(')[0]}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Tendency: {preset.expectedTendency}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CSV File Upload Strip */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        border: '1px dashed var(--border-medium)',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} style={{ color: 'var(--teal-400)' }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Load Custom CSV Window
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Upload any CSV with columns: [Close, Volume] or [Date, Close, Volume] (min 10 rows)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,.txt" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
          >
            <Upload size={14} />
            Browse CSV File
          </button>
        </div>
      </div>

      {csvError && (
        <div className="alert-box alert-danger" style={{ marginBottom: '16px' }}>
          <AlertCircle size={16} />
          <span>{csvError}</span>
        </div>
      )}

      {csvSuccess && (
        <div className="alert-box alert-info" style={{ marginBottom: '16px' }}>
          <CheckCircle size={16} style={{ color: 'var(--teal-400)' }} />
          <span>{csvSuccess}</span>
        </div>
      )}

      {/* 10x2 Interactive Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Step (t)</th>
              <th>Sequence Order</th>
              <th>Close Price (₹) [Feature 0]</th>
              <th>Trading Volume [Feature 1]</th>
              <th style={{ textAlign: 'right' }}>Step Value Preview</th>
            </tr>
          </thead>
          <tbody>
            {featuresWindow.map((row, index) => {
              const isLatest = index === 9;
              return (
                <tr key={index} style={{ background: isLatest ? 'rgba(20, 184, 166, 0.05)' : 'transparent' }}>
                  <td className="mono" style={{ color: isLatest ? 'var(--teal-400)' : 'var(--text-muted)', fontWeight: 600 }}>
                    t - {9 - index}
                  </td>
                  <td>
                    {isLatest ? (
                      <span className="badge badge-demo" style={{ fontSize: '10px' }}>Most Recent Step</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Step #{index + 1}</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      value={row[0]}
                      onChange={(e) => handleCellChange(index, 0, e.target.value)}
                      className="input-field mono"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '12px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1000"
                      value={row[1]}
                      onChange={(e) => handleCellChange(index, 1, e.target.value)}
                      className="input-field mono"
                      style={{ width: '150px', padding: '4px 8px', fontSize: '12px' }}
                    />
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    ₹{Number(row[0]).toLocaleString('en-IN', { minimumFractionDigits: 2 })} • {(row[1] / 1000000).toFixed(2)}M sh
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
