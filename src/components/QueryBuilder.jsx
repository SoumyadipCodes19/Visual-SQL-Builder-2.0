import ColumnSelector from './ColumnSelector';
import FilterClause from './FilterClause';
import GroupByClause from './GroupByClause';
import OrderLimit from './OrderLimit';
import ComplexQueryPicker from './ComplexQueryPicker';
import SqlHighlight from './SqlHighlight';
import { buildSQL } from '../utils/queryUtils';

/**
 * QueryBuilder – the main builder card.
 * Props: state fields + callbacks from App.
 */
function QueryBuilder({
  table, schema, selectedColumns, filters,
  orderField, orderDirection, limit,
  groupByField, aggregateFunc, aggregateField,
  onTableChange, onColumnToggle, onSelectAll, onDeselectAll,
  onFiltersChange, onFieldChange, onRunQuery, onReset, onComplexResults,
}) {
  const columns = table && schema[table] ? schema[table] : [];

  let previewSQL = 'Select a table and columns to preview your query...';
  if (table && selectedColumns.size > 0) {
    previewSQL = buildSQL({
      table, selectedColumns, filters,
      orderField, orderDirection, limit, groupByField, aggregateFunc, aggregateField
    });
  }

  const handleFilterChange = (index, newFilter) => {
    const updated = [...filters];
    updated[index] = newFilter;
    onFiltersChange(updated);
  };
  
  const handleAddFilter = () => {
    onFiltersChange([...filters, { field: '', operator: '=', value: '', value2: '', connector: 'AND' }]);
  };
  
  const handleRemoveFilter = (index) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="card query-builder-card">
      <div className="card-header">
        <h2 className="card-title">Query Builder</h2>
        <button className="reset-button" onClick={onReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          Reset
        </button>
      </div>

      <div className="card-content">
        {/* Table Selection */}
        <div className="form-group">
          <label className="form-label">FROM (Select Table)</label>
          <select className="form-select" value={table} onChange={(e) => onTableChange(e.target.value)}>
            <option value="">Choose a table...</option>
            {Object.keys(schema).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Column Selection */}
        <div className="form-group">
          <label className="form-label">SELECT (Choose Columns)</label>
          <ColumnSelector
            columns={columns}
            selectedColumns={selectedColumns}
            onToggle={onColumnToggle}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
          />
        </div>

        {/* WHERE Clause */}
        <div className="form-group">
          <label className="form-label">WHERE (Optional Filter)</label>
          {filters.map((f, i) => (
            <FilterClause
              key={i}
              columns={columns}
              filter={f}
              index={i}
              onChange={handleFilterChange}
              onRemove={handleRemoveFilter}
              showConnector={i > 0}
            />
          ))}
          <button
            className="report-button"
            style={{ marginTop: '8px', padding: '4px 8px', fontSize: '0.8rem', background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }}
            onClick={handleAddFilter}
          >
            + Add Condition
          </button>
        </div>

        {/* GROUP BY & Aggregation */}
        <div className="form-group">
          <label className="form-label">GROUP BY &amp; Aggregates (Optional)</label>
          <GroupByClause
            columns={columns}
            groupByField={groupByField}
            aggregateFunc={aggregateFunc}
            aggregateField={aggregateField}
            onChange={onFieldChange}
          />
        </div>

        {/* ORDER BY + LIMIT */}
        <OrderLimit
          columns={columns}
          orderField={orderField}
          orderDirection={orderDirection}
          limit={limit}
          onChange={onFieldChange}
        />

        {/* Complex / Nested Query Picker */}
        <ComplexQueryPicker onResults={onComplexResults} />

        {/* Live SQL Preview */}
        <div className="form-group" style={{ marginTop: '24px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
            Live SQL Preview
          </label>
          <div style={{
            background: '#f8fafc', color: '#334155', padding: '12px',
            borderRadius: '6px', fontSize: '0.9rem', overflowX: 'auto',
            margin: 0, fontFamily: '"Fira Code", monospace',
            border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap'
          }}>
            <SqlHighlight sql={previewSQL} />
          </div>
        </div>

        {/* Run Query Button */}
        <button className="run-query-button" onClick={onRunQuery} style={{ marginTop: '16px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20"
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run Query
        </button>
      </div>
    </div>
  );
}

export default QueryBuilder;
