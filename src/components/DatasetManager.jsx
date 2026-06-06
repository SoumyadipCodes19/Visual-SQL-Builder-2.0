import { useState, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function DatasetManager({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-csv`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage(`Success! Table '${data.tableName}' created with ${data.rowCount} rows.`);
      if (onUploadSuccess) onUploadSuccess();
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label 
        style={{
          cursor: uploading ? 'not-allowed' : 'pointer',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px dashed #cbd5e1',
          background: '#f8fafc',
          fontWeight: '500',
          fontSize: '0.9rem',
          color: uploading ? '#94a3b8' : '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>+</span> CSV
        <input 
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }}
          onChange={handleUpload}
          disabled={uploading}
          ref={fileInputRef}
        />
      </label>
      {message && (
        <span style={{ fontSize: '0.8rem', color: message.startsWith('Error') ? '#ef4444' : '#10b981' }}>
          {message}
        </span>
      )}
    </div>
  );
}

export default DatasetManager;
