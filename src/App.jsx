import { useState, useEffect } from 'react';
import Header from './components/Header';
import QueryBuilder from './components/QueryBuilder';
import ResultsPanel from './components/ResultsPanel';
import ERDiagram from './components/ERDiagram';
import QueryHistory from './components/QueryHistory';
import ReportsSection from './components/ReportsSection';
import { DB_SCHEMA, MOCK_DATA } from './data/schema';
import { buildSQL, processMockData } from './utils/queryUtils';

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
    if (!table) return;
    const all = new Set(DB_SCHEMA[table].map((c) => c.name));
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

  function handleRunQuery() {
    if (!table) return;
    const state = { table, selectedColumns, filters, orderField, orderDirection, limit, groupByField, aggregateFunc, aggregateField };
    const sql = buildSQL(state);
    const rows = processMockData(state, MOCK_DATA);
    
    // Headers are derived from selected columns + aggregate column
    const headers = Array.from(selectedColumns);
    if (aggregateFunc && aggregateField) {
      headers.push(`${aggregateFunc.toLowerCase()}_${aggregateField}`);
    }

    setResults({ visible: true, sql, headers, rows });
    
    // Add to history (limit 5)
    setQueryHistory(prev => {
      const newEntry = { sql, time: new Date().toLocaleTimeString() };
      return [newEntry, ...prev].slice(0, 5);
    });
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
      />
      <main className="main-container">
        {showERD && <ERDiagram />}
        <div className="grid-container">
          {/* Left Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <QueryBuilder
              table={table}
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
