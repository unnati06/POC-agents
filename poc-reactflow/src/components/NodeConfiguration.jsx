import { useAppContext } from '../store';
import { useState, useEffect } from 'react';

export function NodeConfigurator() {
  const { openAPISpec, nodes, setNodes } = useAppContext(); 
  const [selectedNode, setSelectedNode] = useState(null);

 
  useEffect(() => {
    const selected = nodes.find((n) => n.selected);
    setSelectedNode(selected);
  }, [nodes]);

  if (!selectedNode) return null;

  
  const action = selectedNode.data.action;
  const endpoint = openAPISpec?.paths?.[action.path]?.[action.method];
  const parameters = endpoint?.parameters || [];
  
  if (!endpoint) return null;


  const handleInputChange = (paramName, value) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            inputs: { ...node.data.inputs, [paramName]: value }
          }
        };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  return (
    <div style={{
      position: 'absolute',
      right: 16,
      top: 16,
      width: 300,
      background: '#1a1a1a',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      color: '#fff',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      border: '1px solid #333'
    }}>
      <h4 style={{
        margin: '0 0 16px 0',
        color: '#00ff9d',
        fontSize: '1.1rem',
        fontWeight: 600,
        borderBottom: '1px solid #333',
        paddingBottom: 8
      }}>{selectedNode.data.label}</h4>
      {parameters.map((param) => (
        <div key={param.name} style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: '0.9rem',
            color: '#888'
          }}>
            {param.name} {param.required && <span style={{ color: '#ff4757' }}>*</span>}
          </label>
          <input
            type="text"
            value={selectedNode.data.inputs[param.name] || ''}
            onChange={(e) => handleInputChange(param.name, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#2d2d2d',
              border: '1px solid #444',
              borderRadius: 4,
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              '&:focus': {
                borderColor: '#00ff9d',
                boxShadow: '0 0 0 2px rgba(0, 255, 157, 0.1)'
              }
            }}
          />
        </div>
      ))}
    </div>
  );
} 