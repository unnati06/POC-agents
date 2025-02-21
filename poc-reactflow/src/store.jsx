// context.js
import React, { createContext, useState, useContext } from 'react';
import { loadOpenAPISpec, extractActions } from './utils/openapi';
import { actionsToNodes } from './utils/flow';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [openAPISpec, setOpenAPISpec] = useState(null);
  const [actions, setActions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const loadSpec = async (url) => {
    setNodes([]);
    setEdges([]);
    const spec = await loadOpenAPISpec(url);
    const newActions = extractActions(spec);
    const newNodes = actionsToNodes(newActions);
    setOpenAPISpec(spec);
    setActions(newActions);
    // setNodes(newNodes);
  };

  const value = {
    openAPISpec,
    actions,
    nodes,
    edges,
    setNodes,
    setEdges,
    loadSpec
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
}