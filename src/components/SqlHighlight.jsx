import React from 'react';

/**
 * A lightweight, dependency-free SQL syntax highlighter.
 * Splits a SQL string into tokens (strings, numbers, keywords, identifiers)
 * and wraps them in styled <span> tags for syntax highlighting.
 */
function SqlHighlight({ sql }) {
  if (!sql) return null;

  // Handles strings ('...'), numbers, SQL keywords, symbols, and normal identifiers
  const tokenRegex = /('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:SELECT|FROM|WHERE|AND|OR|LIKE|BETWEEN|ORDER BY|GROUP BY|ASC|DESC|LIMIT|COUNT|SUM|AVG|MAX|MIN|AS|WITH|JOIN|INNER|LEFT|RIGHT|ON|HAVING|PARTITION BY|OVER|RANK)\b)|([^'\d\w]+)|(\w+)/gi;

  const tokens = [];
  let match;
  let keyIdx = 0;
  
  while ((match = tokenRegex.exec(sql)) !== null) {
    if (match[1]) {
      tokens.push(<span key={keyIdx++} style={{ color: '#d97706' }}>{match[1]}</span>);
    } else if (match[2]) {
      tokens.push(<span key={keyIdx++} style={{ color: '#059669' }}>{match[2]}</span>);
    } else if (match[3]) {
      tokens.push(<strong key={keyIdx++} style={{ color: '#2563eb' }}>{match[3].toUpperCase()}</strong>);
    } else if (match[4]) {
      tokens.push(<span key={keyIdx++} style={{ color: '#9ca3af' }}>{match[4]}</span>);
    } else if (match[5]) {
      tokens.push(<span key={keyIdx++} style={{ color: '#374151' }} className="sql-identifier">{match[5]}</span>);
    }
  }

  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
      {tokens}
    </div>
  );
}

export default SqlHighlight;
