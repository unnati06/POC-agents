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

  // Update JSON when canvas changes
  useEffect(() => {
    if (!isEditing) {
      const newJson = JSON.stringify(flowToAgentsJson(nodes, edges), null, 2);
      setJson(newJson);
      setError(null);
    }
  }, [nodes, edges, isEditing]);

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

  // Handle initial mount and value changes
  const handleEditorMount = (editor) => {
    if (json) {
      updateCanvas(json);
    }
  };

  const handleSaveJson = () => {
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'agents.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to save JSON file');
    }
  };

  return (
    <div className="h-full w-full">
      <h3 className="text-xl text-center border-none">Text Editor</h3>
      <button
        onClick={handleSaveJson}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Save JSON
      </button>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={json}
        onChange={handleJsonChange}
        onMount={handleEditorMount}
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
