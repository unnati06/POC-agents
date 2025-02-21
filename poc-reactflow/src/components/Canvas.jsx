import React from 'react'
import { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background,MarkerType, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { Sidebar } from './Sidebar';
import { useAppContext } from '../store';
import { NodeConfigurator } from './NodeConfiguration';

export function Canvas() {
  const { nodes: contextNodes, edges: contextEdges, setNodes: setContextNodes, setEdges: setContextEdges } = useAppContext();
  
  console.log('Initial contextNodes:', contextNodes);

  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  
  useEffect(() => {
    if (contextNodes && Array.isArray(contextNodes)) {
      const validNodes = contextNodes.map((node, index) => ({
        ...node,
        type: 'apiAction',
        position: {
          x: node.position?.x || 250,
          y: node.position?.y || index * 150
        }
      }));
      setNodes(validNodes);
    }
  }, [contextNodes]);

  
  const onNodesDelete = (nodesToDelete) => {
    
    const deletedNodeIds = new Set(nodesToDelete.map(node => node.id));
    
    
    const newEdges = edges.filter(edge => 
      !deletedNodeIds.has(edge.source) && !deletedNodeIds.has(edge.target)
    );
    setEdges(newEdges);
    setContextEdges(newEdges);

    
    const remainingNodes = nodes
      .filter(node => !deletedNodeIds.has(node.id))
      .map((node, index) => ({
        ...node,
        position: {
          x: node.position.x,
          y: index * 150 
        }
      }));

   
    setNodes(remainingNodes);
    setContextNodes(remainingNodes);
  };

  
  const handleNodesChange = (changes) => {
    onNodesChange(changes);
    
    
    const deletionChanges = changes.filter(change => change.type === 'remove');
    if (deletionChanges.length > 0) {
      const nodesToDelete = nodes.filter(node => 
        deletionChanges.some(change => change.id === node.id)
      );
      onNodesDelete(nodesToDelete);
      return;
    }

   
    if (changes.some(change => change.type === 'position')) {
      const updatedNodes = nodes.map(node => {
        const change = changes.find(c => c.id === node.id && c.type === 'position');
        return change ? { ...node, position: change.position } : node;
      });
      setContextNodes(updatedNodes);
    }
  };

  
  const handleEdgesChange = (changes) => {
    onEdgesChange(changes);
    setContextEdges(edges);
  };

  const onEdgesDelete = (edgesToDelete) => {
    const edgeIds = new Set(edgesToDelete.map(edge => edge.id));
    setEdges(edges.filter(edge => !edgeIds.has(edge.id)));
  };

  const onDragOver = (event) => {
    event.preventDefault(); 
    event.dataTransfer.dropEffect = "move"; 
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
    const actionData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

   
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };

   
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'apiAction',
      position,
      data: {
        label: `${actionData.method.toUpperCase()} ${actionData.path}`,
        action: actionData,
        inputs: {}
      }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const edgeOptions = {
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: '#888' },
    animated: true,
  };
  
  const CustomEdge = ({ data, ...props }) => {
    return (
      <BaseEdge
        {...props}
        label={<div className="edge-label">{data?.label}</div>}
      />
    );
  };
  
  // Register edge type
  const edgeTypes = {
    custom: CustomEdge,
  };

  console.log('Canvas - Rendering with nodes:', nodes);

  return (
    <div className="flex h-screen" onDragOver={onDragOver}>
      <Sidebar />
      <div className='flex-1 relative h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          nodeTypes={edgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <Background />
          <Controls />
        </ReactFlow>
        <NodeConfigurator />
      </div>
    </div>
  );
}

export default Canvas