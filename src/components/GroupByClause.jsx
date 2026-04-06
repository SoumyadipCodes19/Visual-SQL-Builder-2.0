/**
 * GroupByClause – lets users pick a column to group by, and an aggregate function.
 * Props:
 *   columns        – array of { name, type }
 *   groupByField   – string (column to group by)
 *   aggregateFunc  – string ('', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN')
 *   aggregateField – string (column to aggregate)
 *   onChange       – (field, value) => void
 */
function GroupByClause({ columns, groupByField, aggregateFunc, aggregateField, onChange }) {
  if (!columns || columns.length === 0) return null;

  // For sum, avg, max, min it's usually better to pick numeric columns,
  // but COUNT can apply to any.
  const isNumericFunc = ['SUM', 'AVG', 'MAX', 'MIN'].includes(aggregateFunc);
  const aggregateColumnOptions = isNumericFunc
    ? columns.filter((c) => c.type === 'numeric' || c.type === 'integer')
    : columns;

  return (
    <div className="group-by-clause">
      {/* 1. Group By Select */}
      <select
        className="form-select"
        value={groupByField}
        onChange={(e) => onChange('groupByField', e.target.value)}
        style={{ flex: 1 }}
      >
        <option value="">No Grouping (GROUP BY)</option>
        {columns.map((col) => (
          <option key={col.name} value={col.name}>
            {col.name}
          </option>
        ))}
      </select>

      {/* 2. Aggregate Function */}
      <select
        className="form-select"
        value={aggregateFunc}
        onChange={(e) => {
          onChange('aggregateFunc', e.target.value);
          if (e.target.value === '') {
            onChange('aggregateField', '');
          }
        }}
        style={{ flex: 1 }}
      >
        <option value="">No Aggregate</option>
        <option value="COUNT">COUNT()</option>
        <option value="SUM">SUM()</option>
        <option value="AVG">AVG()</option>
        <option value="MAX">MAX()</option>
        <option value="MIN">MIN()</option>
      </select>

      {/* 3. Aggregate Field (only show if func is selected) */}
      {aggregateFunc && (
        <select
          className="form-select"
          value={aggregateField}
          onChange={(e) => onChange('aggregateField', e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Choose column...</option>
          <option value="*">* (All)</option>
          {aggregateColumnOptions.map((col) => (
            <option key={col.name} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default GroupByClause;
