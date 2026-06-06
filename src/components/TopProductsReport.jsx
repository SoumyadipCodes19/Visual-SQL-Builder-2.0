import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Hardcoded categories derived from DB
const CATEGORIES = ['Electronics', 'Furniture', 'Office'].sort();

/**
 * TopProductsReport – "Top Products by Category" pre-built report card.
 * Props:
 *   onResults – ({ sql, headers, rows }) => void
 */
function TopProductsReport({ onResults }) {
  const [category, setCategory] = useState(CATEGORIES[0] ?? '');
  const [limit, setLimit]       = useState(5);

  async function handleRun() {
    const cat = category;
    const lim = Math.max(1, limit || 5);

    const state = {
      table: 'products',
      selectedColumns: ['name', 'category', 'price', 'stock'],
      filters: [{ field: 'category', operator: '=', value: cat }],
      orderField: 'stock',
      orderDirection: 'DESC',
      limit: lim
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
      const data = await res.json();
      
      const headers = ['name', 'category', 'price', 'stock'];
      onResults({ sql: data.sql, headers, rows: data.rows });
    } catch (err) {
      console.error(err);
      alert('Error running report');
    }
  }

  return (
    <div className="card report-card">
      <h3 className="report-title">Top Products by Category</h3>
      <p className="report-description">Find products in a category</p>
      <div className="report-controls">
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          className="form-input limit-small"
          placeholder="Limit"
          min={1}
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
        />
        <button className="report-button" onClick={handleRun}>Run</button>
      </div>
    </div>
  );
}

export default TopProductsReport;
