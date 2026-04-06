import { useState } from 'react';
import SqlHighlight from './SqlHighlight';

/**
 * ResultsPanel – shows empty state or SQL + results table.
 * Props:
 *   results – { visible: bool, sql: string, headers: string[], rows: object[] }
 */
function ResultsPanel({ results }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(results.sql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleDownloadCSV() {
    const { headers, rows } = results;
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csvRows = [
      headers.map(escape).join(','),
      ...rows.map((row) => headers.map((h) => escape(row[h] ?? '')).join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'query_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderCell(value) {
    if (value === null || value === undefined) {
      return <span className="null-cell">NULL</span>;
    }
    return String(value);
  }

  return (
    <div className="card results-card">
      <div className="card-header">
        <h2 className="card-title">Results</h2>
        {results.visible && (
          <span className="row-count-badge">
            {results.rows.length} {results.rows.length === 1 ? 'row' : 'rows'}
          </span>
        )}
      </div>

      <div className="card-content">
        {!results.visible ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64" height="64"
              viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="empty-icon"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <p className="empty-text">
              No query executed yet. Build a query and click 'Run Query' to see results.
            </p>
          </div>
        ) : (
          <div className="results-table-container">
            <div className="sql-display">
              <div className="sql-display-header">
                <strong>SQL:</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="copy-sql-button" onClick={handleCopy} title="Copy SQL to clipboard">
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <button className="copy-sql-button download-csv-button" onClick={handleDownloadCSV} title="Download results as CSV">
                    ⬇ CSV
                  </button>
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                <SqlHighlight sql={results.sql} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="results-table">
                <thead>
                  <tr>{results.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {results.rows.length === 0 ? (
                    <tr>
                      <td colSpan={results.headers.length} style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                        No results matched your query.
                      </td>
                    </tr>
                  ) : (
                    results.rows.map((row, i) => (
                      <tr key={i}>
                        {results.headers.map((h) => <td key={h}>{renderCell(row[h])}</td>)}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPanel;
