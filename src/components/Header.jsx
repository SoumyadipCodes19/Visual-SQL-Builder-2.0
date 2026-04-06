/**
 * Header – simple site header with feature toggles.
 */
function Header({ onToggleERD }) {
  return (
    <header className="header">
      <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </div>
          <div>
            <h1 className="header-title">Visual SQL Query Builder</h1>
            <p className="header-subtitle">
              Build and execute SQL queries using an intuitive visual interface
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onToggleERD} 
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📊 Schema ERD
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
