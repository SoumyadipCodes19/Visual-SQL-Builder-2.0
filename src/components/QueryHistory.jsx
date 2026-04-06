import React from 'react';
import SqlHighlight from './SqlHighlight';

function QueryHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2 className="card-title">
           <span style={{ marginRight: '8px' }}>🕒</span> 
           Query History
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Last 5 queries</span>
      </div>
      <div className="card-content" style={{ padding: '0' }}>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
          {history.map((entry, idx) => (
            <li 
              key={idx} 
              style={{ 
                padding: '12px 16px', 
                borderBottom: idx === history.length - 1 ? 'none' : '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 'bold' }}>
                Executed at: {entry.time}
              </div>
              <div style={{ 
                background: '#f8fafc', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}>
                <SqlHighlight sql={entry.sql} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QueryHistory;
