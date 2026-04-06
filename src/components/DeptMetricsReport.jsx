import { useState } from 'react';

/**
 * DeptMetricsReport – "Department Metrics" pre-built report card.
 * Props:
 *   onResults – ({ sql, headers, rows }) => void
 */
function DeptMetricsReport({ onResults }) {
  const [dept, setDept] = useState('');

  function handleRun() {
    const selectedDept = dept || 'all';
    const formattedDept = selectedDept.charAt(0).toUpperCase() + selectedDept.slice(1);

    const sql =
      `SELECT department_id, COUNT(*) as employee_count\nFROM employees` +
      (selectedDept !== 'all' ? `\nWHERE department_id = '${selectedDept}'` : '') +
      `\nGROUP BY department_id`;

    const headers = ['department_id (Label)', 'employee_count'];
    let rows;

    if (selectedDept !== 'all') {
      rows = [{ 'department_id (Label)': formattedDept, employee_count: Math.floor(Math.random() * 20) + 5 }];
    } else {
      rows = [
        { 'department_id (Label)': 'Engineering', employee_count: 45 },
        { 'department_id (Label)': 'Sales', employee_count: 20 },
        { 'department_id (Label)': 'Marketing', employee_count: 15 },
        { 'department_id (Label)': 'Human Resources', employee_count: 5 },
      ];
    }

    onResults({ sql, headers, rows });
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
