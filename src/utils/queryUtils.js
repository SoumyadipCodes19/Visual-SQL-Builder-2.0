/**
 * Builds the SQL query string from current state.
 */
export function buildSQL(state) {
  const colsArray = Array.from(state.selectedColumns);
  let selectClause = colsArray.join(', ');
  
  if (state.aggregateFunc && state.aggregateField) {
    const aggCol = `${state.aggregateFunc}(${state.aggregateField}) AS ${state.aggregateFunc.toLowerCase()}_${state.aggregateField}`;
    selectClause = selectClause ? `${selectClause}, ${aggCol}` : aggCol;
  }
  
  let sql = `SELECT ${selectClause || '*'} FROM ${state.table}`;

  const validFilters = state.filters ? state.filters.filter(f => f.field && f.value) : [];
  if (validFilters.length > 0) {
    sql += '\nWHERE ';
    validFilters.forEach((f, i) => {
      const isNumeric = !isNaN(f.value) && f.value.trim() !== '';
      const valFormatted = isNumeric ? f.value : `'${f.value}'`;
      
      let conditionStr = '';
      if (f.operator === 'LIKE') {
        conditionStr = `${f.field} LIKE '%${f.value}%'`;
      } else if (f.operator === 'BETWEEN') {
        const isNum2 = f.value2 && !isNaN(f.value2) && f.value2.trim() !== '';
        const val2Formatted = isNum2 ? f.value2 : `'${f.value2 || ''}'`;
        conditionStr = `${f.field} BETWEEN ${valFormatted} AND ${val2Formatted}`;
      } else {
        conditionStr = `${f.field} ${f.operator} ${valFormatted}`;
      }

      if (i > 0) {
        sql += ` ${f.connector || 'AND'} `;
      }
      sql += conditionStr;
    });
  }

  if (state.groupByField) {
    sql += `\nGROUP BY ${state.groupByField}`;
  }

  if (state.orderField) {
    sql += `\nORDER BY ${state.orderField} ${state.orderDirection}`;
  }

  sql += `\nLIMIT ${state.limit}`;
  return sql;
}

/**
 * Filters, sorts, and slices mock data according to state.
 */
export function processMockData(state, MOCK_DATA) {
  let data = MOCK_DATA[state.table] ? [...MOCK_DATA[state.table]] : [];

  // WHERE — supports =, >, <, >=, <=, !=, LIKE, BETWEEN with AND/OR
  const validFilters = state.filters ? state.filters.filter(f => f.field && f.value) : [];
  if (validFilters.length > 0) {
    data = data.filter((row) => {
      let result = true;
      validFilters.forEach((f, i) => {
        const rawVal  = row[f.field];
        const numericCell  = parseFloat(rawVal);
        const numericQuery = parseFloat(f.value);
        const strCell  = String(rawVal).toLowerCase();
        const strQuery = String(f.value).toLowerCase();

        let conditionMatched = false;
        switch (f.operator) {
          case '=':    conditionMatched = strCell === strQuery; break;
          case '!=':   conditionMatched = strCell !== strQuery; break;
          case '>':    conditionMatched = numericCell >  numericQuery; break;
          case '<':    conditionMatched = numericCell <  numericQuery; break;
          case '>=':   conditionMatched = numericCell >= numericQuery; break;
          case '<=':   conditionMatched = numericCell <= numericQuery; break;
          case 'LIKE': conditionMatched = strCell.includes(strQuery); break;
          case 'BETWEEN': {
             if (!isNaN(numericCell) && !isNaN(numericQuery) && f.value2 && !isNaN(parseFloat(f.value2))) {
               conditionMatched = numericCell >= numericQuery && numericCell <= parseFloat(f.value2);
             } else {
               const strQuery2 = String(f.value2 || '').toLowerCase();
               conditionMatched = strCell >= strQuery && strCell <= strQuery2;
             }
             break;
          }
          default: conditionMatched = true; break;
        }

        if (i === 0) {
          result = conditionMatched;
        } else {
          if (f.connector === 'AND') result = result && conditionMatched;
          else if (f.connector === 'OR') result = result || conditionMatched;
        }
      });
      return result;
    });
  }

  // GROUP BY & AGGREGATION
  if (state.groupByField) {
    const groups = {};
    data.forEach((row) => {
      const key = row[state.groupByField];
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    data = Object.keys(groups).map((key) => {
      const groupRows = groups[key];
      const resultRow = { [state.groupByField]: key };
      
      Array.from(state.selectedColumns).forEach((c) => {
        resultRow[c] = groupRows[0][c] ?? null;
      });

      if (state.aggregateFunc && state.aggregateField) {
        let aggVal = 0;
        const vals = groupRows.map((r) => parseFloat(r[state.aggregateField]) || 0);
        if (state.aggregateFunc === 'COUNT') aggVal = groupRows.length;
        else if (state.aggregateFunc === 'SUM') aggVal = vals.reduce((a, b) => a + b, 0);
        else if (state.aggregateFunc === 'AVG') aggVal = vals.reduce((a, b) => a + b, 0) / vals.length;
        else if (state.aggregateFunc === 'MAX') aggVal = Math.max(...vals);
        else if (state.aggregateFunc === 'MIN') aggVal = Math.min(...vals);

        if (state.aggregateFunc === 'AVG') aggVal = Number(aggVal.toFixed(2));
        const aggColName = `${state.aggregateFunc.toLowerCase()}_${state.aggregateField}`;
        resultRow[aggColName] = aggVal;
      }
      return resultRow;
    });
  } else if (state.aggregateFunc && state.aggregateField) {
    let aggVal = 0;
    const vals = data.map((r) => parseFloat(r[state.aggregateField]) || 0);
    if (state.aggregateFunc === 'COUNT') aggVal = data.length;
    else if (state.aggregateFunc === 'SUM') aggVal = vals.reduce((a, b) => a + b, 0);
    else if (state.aggregateFunc === 'AVG') aggVal = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    else if (state.aggregateFunc === 'MAX') aggVal = vals.length ? Math.max(...vals) : null;
    else if (state.aggregateFunc === 'MIN') aggVal = vals.length ? Math.min(...vals) : null;

    if (state.aggregateFunc === 'AVG' && typeof aggVal === 'number') aggVal = Number(aggVal.toFixed(2));
    const aggColName = `${state.aggregateFunc.toLowerCase()}_${state.aggregateField}`;

    const resultRow = {};
    Array.from(state.selectedColumns).forEach((c) => {
      resultRow[c] = data[0]?.[c] ?? null;
    });
    resultRow[aggColName] = aggVal;
    data = [resultRow];
  }

  // ORDER BY
  if (state.orderField) {
    data.sort((a, b) => {
      let valA = a[state.orderField];
      let valB = b[state.orderField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        const cmp = valA.localeCompare(valB);
        return state.orderDirection === 'ASC' ? cmp : -cmp;
      } else {
        valA = valA ?? 0;
        valB = valB ?? 0;
        return state.orderDirection === 'ASC' ? valA - valB : valB - valA;
      }
    });
  }

  // LIMIT + PROJECT — only return selected columns (and aggregates)
  const cols = Array.from(state.selectedColumns);
  
  let aggColName = null;
  if (state.aggregateFunc && state.aggregateField) {
    aggColName = `${state.aggregateFunc.toLowerCase()}_${state.aggregateField}`;
  }

  return data.slice(0, state.limit).map((row) => {
    const projected = {};
    cols.forEach((c) => { projected[c] = row[c] ?? null; });
    if (aggColName) {
      projected[aggColName] = row[aggColName] ?? null;
    }
    return projected;
  });
}
