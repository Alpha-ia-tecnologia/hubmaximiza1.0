import React, { useState } from 'react';
import styled from 'styled-components';
import api, { testConnection } from '../utils/api';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-width: 300px;
  font-size: 0.85rem;
`;

const DebugButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  font-size: 0.8rem;

  &:hover {
    background: var(--secondary-color);
  }
`;

const DebugLog = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-family: monospace;
  font-size: 0.75rem;
`;

const ApiDebug = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const testAPI = async () => {
    addLog('🧪 Testando conectividade...', 'info');
    
    const isConnected = await testConnection();
    if (isConnected) {
      addLog('✅ API conectada com sucesso!', 'success');
    } else {
      addLog('❌ Falha na conexão com API', 'error');
    }
  };

  const testLogin = async () => {
    addLog('🔐 Testando login...', 'info');
    
    try {
      const response = await api.post('/auth/login', {
        email: 'admin@hubmaximiza.com',
        password: 'admin123'
      });
      
      addLog('✅ Login funcionando!', 'success');
      addLog(`Token: ${response.data.token.substring(0, 20)}...`, 'info');
    } catch (error) {
      addLog(`❌ Erro no login: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (!isVisible) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <DebugButton onClick={() => setIsVisible(true)}>
          🔧 Debug API
        </DebugButton>
      </div>
    );
  }

  return (
    <DebugContainer>
      <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
        API Debug Console
        <button 
          onClick={() => setIsVisible(false)}
          style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
      
      <div>
        <DebugButton onClick={testAPI}>Test API</DebugButton>
        <DebugButton onClick={testLogin}>Test Login</DebugButton>
        <DebugButton onClick={clearLogs}>Clear</DebugButton>
      </div>

      <DebugLog>
        {logs.map((log, index) => (
          <div key={index} style={{
            color: log.type === 'error' ? '#dc3545' : 
                   log.type === 'success' ? '#28a745' : '#333',
            marginBottom: '0.25rem'
          }}>
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </DebugLog>
    </DebugContainer>
  );
};

export default ApiDebug;
