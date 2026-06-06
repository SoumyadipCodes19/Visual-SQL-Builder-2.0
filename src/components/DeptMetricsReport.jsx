import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * DeptMetricsReport – "Department Metrics" pre-built report card.
 * Props:
 *   onResults – ({ sql, headers, rows }) => void
 */
function DeptMetricsReport({ authToken, onResults }) {
  const [dept, setDept] = useState('');

  async function handleRun() {
    const selectedDept = dept || 'all';
    
    const state = {
      table: 'employees',
      selectedColumns: ['department_id'],
      filters: selectedDept !== 'all' ? [{ field: 'department_id', operator: '=', value: selectedDept }] : [],
      groupByField: 'department_id',
      aggregateFunc: 'COUNT',
      aggregateField: 'id'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(state)
      });
      const data = await res.json();
      
      const headers = ['department_id', 'count_id'];
      onResults({ sql: data.sql, headers, rows: data.rows });
    } catch (err) {
      console.error(err);
      alert('Error running report');
    }
  }

  return (
    <div className="card report-card">
      <h3 className="report-title">Department Metrics</h3>
      <p className="report-description">Get employee count by department</p>
      <div className="report-controls">
        <select
          className="form-select"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="engineering">Engineering</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="hr">Human Resources</option>
        </select>
        <button className="report-button" onClick={handleRun}>Run</button>
      </div>
    </div>
  );
}

export default DeptMetricsReport;
