import { useState, useEffect } from 'react';
import Header from './components/Header';
import QueryBuilder from './components/QueryBuilder';
import ResultsPanel from './components/ResultsPanel';
import ERDiagram from './components/ERDiagram';
import QueryHistory from './components/QueryHistory';
import ReportsSection from './components/ReportsSection';
import { buildSQL } from './utils/queryUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const INITIAL_STATE = {
  table: '',
  selectedColumns: new Set(),
  filters: [{ field: '', operator: '=', value: '', value2: '', connector: 'AND' }],
  orderField: '',
  orderDirection: 'ASC',
  limit: 10,
  groupByField: '',
  aggregateFunc: '',
  aggregateField: '',
};

function App() {
  const [schema, setSchema] = useState({});
  const [table, setTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [filters, setFilters] = useState(INITIAL_STATE.filters);
  const [orderField, setOrderField] = useState(INITIAL_STATE.orderField);
  const [orderDirection, setOrderDirection] = useState(INITIAL_STATE.orderDirection);
  const [limit, setLimit] = useState(INITIAL_STATE.limit);
  const [groupByField, setGroupByField] = useState(INITIAL_STATE.groupByField);
  const [aggregateFunc, setAggregateFunc] = useState(INITIAL_STATE.aggregateFunc);
  const [aggregateField, setAggregateField] = useState(INITIAL_STATE.aggregateField);

  const [results, setResults] = useState({ visible: false, sql: '', headers: [], rows: [] });
  const [queryHistory, setQueryHistory] = useState([]);
  const [showERD, setShowERD] = useState(false);

  const fetchSchema = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/schema`);
      const data = await res.json();
      setSchema(data);
    } catch (err) {
      console.error("Failed to fetch schema:", err);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  // --- Handlers ---

  function handleTableChange(newTable) {
    setTable(newTable);
    setSelectedColumns(new Set()); // clear columns on table switch
    setFilters(INITIAL_STATE.filters);
    setOrderField('');
    setGroupByField('');
    setAggregateFunc('');
    setAggregateField('');
  }

  function handleColumnToggle(colName, checked) {
    setSelectedColumns((prev) => {
      const next = new Set(prev);
      if (checked) next.add(colName);
      else next.delete(colName);
      return next;
    });
  }

  function handleSelectAll() {
    if (!table || !schema[table]) return;
    const all = new Set(schema[table].map((c) => c.name));
    setSelectedColumns(all);
  }

  function handleDeselectAll() {
    setSelectedColumns(new Set());
  }

  function handleFieldChange(field, value) {
    const setters = {
      orderField: setOrderField,
      orderDirection: setOrderDirection,
      limit: setLimit,
      groupByField: setGroupByField,
      aggregateFunc: setAggregateFunc,
      aggregateField: setAggregateField,
    };
    setters[field]?.(value);
  }

  async function handleRunQuery() {
    if (!table) return;
    const state = { table, selectedColumns: Array.from(selectedColumns), filters, orderField, orderDirection, limit, groupByField, aggregateFunc, aggregateField };
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Query failed');

      // Headers are derived from selected columns + aggregate column
      const headers = Array.from(selectedColumns);
      if (aggregateFunc && aggregateField) {
        headers.push(`${aggregateFunc.toLowerCase()}_${aggregateField}`);
      }

      setResults({ visible: true, sql: data.sql, headers, rows: data.rows });
      
      // Add to history (limit 5)
      setQueryHistory(prev => {
        const newEntry = { sql: data.sql, time: new Date().toLocaleTimeString() };
        return [newEntry, ...prev].slice(0, 5);
      });
    } catch (err) {
      console.error(err);
      alert('Error running query: ' + err.message);
    }
  }

  function handleReset() {
    setTable(INITIAL_STATE.table);
    setSelectedColumns(new Set(INITIAL_STATE.selectedColumns));
    setFilters(INITIAL_STATE.filters);
    setOrderField(INITIAL_STATE.orderField);
    setOrderDirection(INITIAL_STATE.orderDirection);
    setLimit(INITIAL_STATE.limit);
    setGroupByField(INITIAL_STATE.groupByField);
    setAggregateFunc(INITIAL_STATE.aggregateFunc);
    setAggregateField(INITIAL_STATE.aggregateField);
    setResults({ visible: false, sql: '', headers: [], rows: [] });
  }

  function handleReportResults({ sql, headers, rows }) {
    setResults({ visible: true, sql, headers, rows });
  }

  return (
    <>
      <Header 
        onToggleERD={() => setShowERD(!showERD)} 
        onSchemaRefresh={fetchSchema}
      />
      <main className="main-container">
        {showERD && <ERDiagram schema={schema} />}
        <div className="grid-container">
          {/* Left Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <QueryBuilder
              table={table}
              schema={schema}
              selectedColumns={selectedColumns}
              filters={filters}
              onFiltersChange={setFilters}
              orderField={orderField}
              orderDirection={orderDirection}
              limit={limit}
              groupByField={groupByField}
              aggregateFunc={aggregateFunc}
              aggregateField={aggregateField}
              onTableChange={handleTableChange}
              onColumnToggle={handleColumnToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onFieldChange={handleFieldChange}
              onRunQuery={handleRunQuery}
              onReset={handleReset}
              onComplexResults={handleReportResults}
            />
            <QueryHistory history={queryHistory} />
          </div>

          {/* Right Main Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ResultsPanel results={results} />
            <ReportsSection onResults={handleReportResults} />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
