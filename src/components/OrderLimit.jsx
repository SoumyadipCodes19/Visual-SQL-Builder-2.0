/**
 * OrderLimit – ORDER BY + LIMIT row.
 * Props:
 *   columns        – array of { name, type }
 *   orderField     – string
 *   orderDirection – 'ASC' | 'DESC'
 *   limit          – number
 *   onChange       – (field, value) => void
 */
function OrderLimit({ columns, orderField, orderDirection, limit, onChange }) {
  return (
    <div className="form-row">
      <div className="form-group form-group-flex">
        <label className="form-label">ORDER BY</label>
        <div className="order-controls">
          <select
            className="form-select order-field"
            value={orderField}
            onChange={(e) => onChange('orderField', e.target.value)}
          >
            <option value="">Field</option>
            {columns.map((col) => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>

          <select
            className="form-select order-direction"
            value={orderDirection}
            onChange={(e) => onChange('orderDirection', e.target.value)}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
      </div>

      <div className="form-group form-group-flex">
        <label className="form-label">LIMIT</label>
        <input
          type="number"
          className="form-input limit-input"
          placeholder="10"
          value={limit}
          onChange={(e) => onChange('limit', parseInt(e.target.value) || 10)}
        />
      </div>
    </div>
  );
}

export default OrderLimit;
