import DeptMetricsReport from './DeptMetricsReport';
import TopProductsReport from './TopProductsReport';

/**
 * ReportsSection – wrapper for pre-built report cards.
 * Props:
 *   onResults – ({ sql, headers, rows }) => void
 */
function ReportsSection({ schema, authToken, onResults }) {
  return (
    <div className="reports-section">
      <h2 className="section-title">Reports</h2>
      <div className="reports-grid">
        <DeptMetricsReport authToken={authToken} onResults={onResults} />
        <TopProductsReport authToken={authToken} onResults={onResults} />
      </div>
    </div>
  );
}

export default ReportsSection;
