/**
 * FilterClause – WHERE clause row.
 * Props:
 *   filter        – object { field, operator, value, value2, connector }
 *   index         – number
 *   onChange      – (index, updatedFilter) => void
 *   onRemove      – (index) => void
 *   showConnector – boolean (if true, shows AND/OR dropdown)
 */
function FilterClause({ columns, filter, index, onChange, onRemove, showConnector }) {
  const handleLocalChange = (key, val) => {
    onChange(index, { ...filter, [key]: val });
  };

  return (
    <div className="filter-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      {showConnector && (
        <select
          className="form-select"
          style={{ width: '80px' }}
          value={filter.connector}
          onChange={(e) => handleLocalChange('connector', e.target.value)}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      )}

      {!showConnector && <span style={{ width: '80px', display: 'inline-block' }}></span>}

      <select
        className="form-select filter-field"
        value={filter.field}
        onChange={(e) => handleLocalChange('field', e.target.value)}
      >
        <option value="">Field</option>
        {columns.map((col) => (
          <option key={col.name} value={col.name}>{col.name}</option>
        ))}
      </select>

      <select
        className="form-select filter-operator"
        value={filter.operator}
        onChange={(e) => handleLocalChange('operator', e.target.value)}
      >
        <option value="=">equals (=)</option>
        <option value="!=">not equal (!=)</option>
        <option value=">">{`greater than (>)`}</option>
        <option value=">=">{`greater or equal (>=)`}</option>
        <option value="<">{`less than (<)`}</option>
        <option value="<=">{`less or equal (<=)`}</option>
        <option value="BETWEEN">between (BETWEEN)</option>
        <option value="LIKE">contains (LIKE)</option>
      </select>

      <input
        type="text"
        className="form-input filter-value"
        placeholder={filter.operator === 'BETWEEN' ? "From..." : "Value"}
        value={filter.value}
        onChange={(e) => handleLocalChange('value', e.target.value)}
      />

      {filter.operator === 'BETWEEN' && (
        <>
          <span style={{ color: '#6b7280', fontSize: '0.85rem', alignSelf: 'center' }}>AND</span>
          <input
            type="text"
            className="form-input filter-value"
            placeholder="To..."
            value={filter.value2}
            onChange={(e) => handleLocalChange('value2', e.target.value)}
          />
        </>
      )}

      {showConnector && (
        <button
          className="remove-filter-btn"
          onClick={() => onRemove(index)}
          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem'}}
          title="Remove Filter"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default FilterClause;
