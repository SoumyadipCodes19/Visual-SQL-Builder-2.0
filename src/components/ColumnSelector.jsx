/**
 * ColumnSelector – checkbox grid for picking columns from a table.
 * Props:
 *   columns        – array of { name, type }
 *   selectedColumns – Set of selected column names
 *   onToggle       – (colName, checked) => void
 *   onSelectAll    – () => void
 *   onDeselectAll  – () => void
 */
function ColumnSelector({ columns, selectedColumns, onToggle, onSelectAll, onDeselectAll }) {
  if (!columns || columns.length === 0) {
    return (
      <div className="checkbox-grid" style={{ color: '#9ca3af', fontSize: '0.875rem', padding: '16px' }}>
        Select a table to see its columns.
      </div>
    );
  }

  const allSelected = columns.every((col) => selectedColumns.has(col.name));

  return (
    <div>
      {/* Select All / Deselect All toggle */}
      <div className="column-selector-controls">
        <button
          type="button"
          className="select-all-button"
          onClick={allSelected ? onDeselectAll : onSelectAll}
        >
          {allSelected ? '☐ Deselect All' : '☑ Select All'}
        </button>
        <span className="selected-count">
          {selectedColumns.size} / {columns.length} selected
        </span>
      </div>

      <div className="checkbox-grid">
        {columns.map((col) => (
          <label key={col.name} className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              value={col.name}
              checked={selectedColumns.has(col.name)}
              onChange={(e) => onToggle(col.name, e.target.checked)}
            />
            <span className="checkbox-text">
              {col.name} <span className="data-type">({col.type})</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ColumnSelector;
