import React from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Database, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';

export default function ModelArchitecture() {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <BookOpen size={18} style={{ color: 'var(--teal-400)' }} />
            Model Architecture & Theoretical Foundation
          </h2>
          <p className="card-subtitle">
            Reinforcement Learning Trading Agent with Recurrent LSTM State Representation
          </p>
        </div>

        <span className="badge badge-demo">
          Final Year Engineering Specification
        </span>
      </div>

      {/* Visual Pipeline Flow */}
      <div style={{
        padding: '24px 20px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', textAlign: 'center' }}>
          End-to-End Decision Pipeline
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Step 1 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'center',
            minWidth: '130px'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>INPUT TENSOR</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Market Features
            </div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--teal-400)', marginTop: '2px' }}>
              Shape: (10, 2)
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>[Close, Volume]</div>
          </div>

          <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          {/* Step 2 */}
          <div style={{
            background: 'rgba(20, 184, 166, 0.08)',
            border: '1px solid var(--border-teal)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'center',
            minWidth: '140px'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--teal-400)' }}>TEMPORAL MODEL</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              LSTM Layers
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Hidden States (h_t)
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Velocity & Memory</div>
          </div>

          <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          {/* Step 3 */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'center',
            minWidth: '130px'
          }}>
            <div style={{ fontSize: '10px', color: '#38BDF8' }}>RL AGENT</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              DQN Network
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Q(s, a) Estimator
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bellman Optimality</div>
          </div>

          <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          {/* Step 4 */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '10px', color: '#C084FC' }}>VALUE VECTOR</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Q-Values
            </div>
            <div className="mono" style={{ fontSize: '11px', color: '#C084FC', marginTop: '2px' }}>
              [Q_0, Q_1, Q_2]
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Action Values</div>
          </div>

          <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          {/* Step 5 */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '8px',
            padding: '12px 14px',
            textAlign: 'center',
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '10px', color: '#10B981' }}>POLICY SELECTION</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--signal-buy)', marginTop: '2px' }}>
              BUY / SELL / HOLD
            </div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              arg max Q(s, a)
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Discrete Action [0,1,2]</div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Explanatory Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Component 1: LSTM */}
        <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers size={16} style={{ color: 'var(--teal-400)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              1. LSTM State Modeling
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Financial time-series data exhibits non-Markovian dynamics where historical price patterns directly influence impending momentum. 
            The LSTM recurrent network processes a sliding window of 10 consecutive observations <span className="mono">[Close_t, Volume_t]</span>, using forget, input, and output gates to distill temporal trends into a compact latent hidden vector <span className="mono">h_t</span>.
          </p>
        </div>

        {/* Component 2: DQN */}
        <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={16} style={{ color: '#38BDF8' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              2. Deep Q-Network (DQN)
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            The RL agent operates as a Q-learning value function approximator. Taking the latent state representation synthesized by the LSTM, the dense network estimates the expected cumulative discounted future reward <span className="mono">Q(s, a)</span> for each possible discrete action:
            <strong> HOLD (0), BUY (1), and SELL (2)</strong>.
          </p>
        </div>

        {/* Component 3: Policy Execution */}
        <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle size={16} style={{ color: 'var(--signal-buy)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              3. Greedy Policy Formulation
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            During deployment, the agent executes a greedy policy choosing the action with the maximum estimated Q-value: <span className="mono">π(s) = arg max_a Q(s, a)</span>. 
            Reward feedback during training is formulated around portfolio net asset value growth adjusted for transaction friction and drawdown penalties.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Algorithmic Paradigm Comparison
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paradigm</th>
                <th>State Input</th>
                <th>Objective Function</th>
                <th>Adaptation Mechanism</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Traditional Technical Indicators (RSI, MACD)</td>
                <td>Fixed mathematical formulas on price window</td>
                <td>Static heuristic thresholding (e.g. RSI &lt; 30)</td>
                <td>None; fixed rules vulnerable to regime shifts</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Supervised Deep Learning (Regression / Classification)</td>
                <td>Independent feature snapshots or raw sequences</td>
                <td>Minimize MSE / Cross-entropy against target labels</td>
                <td>Passive pattern recognition; ignores portfolio feedback</td>
              </tr>
              <tr style={{ background: 'rgba(20, 184, 166, 0.06)' }}>
                <td style={{ fontWeight: 600, color: 'var(--teal-400)' }}>This Project: LSTM-DQN Reinforcement Learning</td>
                <td className="mono">10×2 Temporal Tensor Window [Close, Volume]</td>
                <td>Maximize discounted cumulative reward (Portfolio NAV)</td>
                <td>Dynamic policy interaction via environment state feedback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Disclosures & Limitations */}
      <div className="alert-box alert-warning">
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px' }}>
          <strong>Academic Disclosures & Model Limitations:</strong>
          <ul style={{ paddingLeft: '18px', marginTop: '4px', lineHeight: '1.5' }}>
            <li>The current LSTM-DQN agent was trained on <strong>synthetic demonstration data</strong> and has <strong>not yet been validated</strong> on live historical NSE tick-level data for Reliance Industries Ltd.</li>
            <li>Reinforcement learning policies trained on synthetic series can overfit to specific artificial volatility distributions and may experience severe slippage or drawdowns in non-stationary real markets.</li>
            <li>This software is engineered strictly as an educational college demonstration of AI/ML algorithms and does NOT constitute financial, investment, or legal advice.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
