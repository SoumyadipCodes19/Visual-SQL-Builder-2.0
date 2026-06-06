import React from 'react';
/**
 * ERDiagram – visually represents the database schema and relationships.
 */
function ERDiagram({ schema = {} }) {
  const tables = Object.keys(schema);
  
  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header" style={{ background: '#f8fafc' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M2 15h10"></path>
            <path d="m9 18 3-3-3-3"></path>
          </svg>
          Entity Relationship Diagram (ERD)
        </h2>
      </div>
      <div className="card-content" style={{ display: 'flex', gap: '32px', overflowX: 'auto', padding: '24px', background: '#f1f5f9' }}>
        {tables.map((tableName) => (
          <div key={tableName} style={{ 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            minWidth: '220px', 
            background: '#ffffff', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            flexShrink: 0
          }}>
             <div style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '12px', 
                fontWeight: 'bold', 
                borderTopLeftRadius: '7px', 
                borderTopRightRadius: '7px', 
                textAlign: 'center',
                letterSpacing: '1px'
             }}>
                {tableName.toUpperCase()}
             </div>
             <div style={{ padding: '0 12px 12px 12px' }}>
                {schema[tableName].map((col, idx) => {
                   const isPK = col.name === 'id';
                   const isFK = col.name.endsWith('_id');
                   return (
                     <div key={col.name} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '8px 0', 
                        borderBottom: idx === schema[tableName].length - 1 ? 'none' : '1px solid #e2e8f0' 
                     }}>
                        <span style={{ 
                          fontWeight: isPK ? 'bold' : 'normal', 
                          color: isPK ? '#1d4ed8' : (isFK ? '#047857' : '#334155'),
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {isPK && <span title="Primary Key">🔑</span>}
                          {isFK && <span title="Foreign Key">🔗</span>}
                          {!isPK && !isFK && <span style={{ width: '16px', display: 'inline-block' }}></span>}
                          {col.name}
                        </span>
                        <span style={{ 
                          color: '#64748b', 
                          fontSize: '0.8rem',
                          background: '#f8fafc',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}>
                          {col.type}
                        </span>
                     </div>
                   );
                })}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ERDiagram;
