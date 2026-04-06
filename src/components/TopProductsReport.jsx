import { useState } from 'react';
import { MOCK_DATA } from '../data/schema';

// Derive unique categories directly from real data
const CATEGORIES = [...new Set(MOCK_DATA.products.map((p) => p.category))].sort();

/**
 * TopProductsReport – "Top Products by Category" pre-built report card.
 * Props:
 *   onResults – ({ sql, headers, rows }) => void
 */
function TopProductsReport({ onResults }) {
  const [category, setCategory] = useState(CATEGORIES[0] ?? '');
  const [limit, setLimit]       = useState(5);

  function handleRun() {
    const cat = category;
    const lim = Math.max(1, limit || 5);

    const sql =
      `SELECT name, category, price, stock\nFROM products\nWHERE category = '${cat}'\nORDER BY stock DESC\nLIMIT ${lim}`;

    const headers = ['name', 'category', 'price', 'stock'];

    const rows = MOCK_DATA.products
      .filter((p) => p.category === cat)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, lim)
      .map(({ name, category: c, price, stock }) => ({ name, category: c, price, stock }));

    onResults({ sql, headers, rows });
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
