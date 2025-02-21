import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../store';
import { flowToAgentsJson } from '../utils/flowToJson';
import { jsonToFlow } from '../utils/jsonToFlow';

export function JsonEditor() {
  const { nodes, edges, setNodes, setEdges } = useAppContext();
  const [json, setJson] = useState('');
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Force an immediate update whenever nodes or edges change
  useEffect(() => {
    // Add a small delay to ensure we catch the latest state
    const timeoutId = setTimeout(() => {
      const newJson = JSON.stringify(flowToAgentsJson(nodes, edges), null, 2);
      setJson(newJson);
      setError(null);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges]);

  const updateCanvas = (jsonValue) => {
    try {
      const parsed = JSON.parse(jsonValue);
      setError(null);
      
      if (parsed.agents && Array.isArray(parsed.agents)) {
        const { nodes: newNodes, edges: newEdges } = jsonToFlow(parsed);
        setNodes(newNodes);
        setEdges(newEdges);
      } else {
        setError('Invalid format: JSON must contain agents array');
      }
    } catch (error) {
      setError(`Invalid JSON: ${error.message}`);
    }
  };

  const handleJsonChange = (value) => {
    setIsEditing(true);
    setJson(value);
    updateCanvas(value);
    setIsEditing(false);
  };

  return (
    <div className="h-full w-full">
      <h3 className="text-xl text-center border-none">Text Editor</h3>
    
      <Editor
      
        height="100%"
        defaultLanguage="json"
        value={json}
        onChange={handleJsonChange}
        options={{ 
          minimap: { enabled: false }, 
          wordWrap: 'on',
          fontSize: 14,
          theme: "vs-dark"
        }}
        theme="vs-dark"
        className="bg-[#1E1E1E] text-white"
      />
      {error && (
        <div className="text-red-500 p-2 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
