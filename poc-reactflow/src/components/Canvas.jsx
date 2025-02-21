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

  // Initialize with empty arrays first
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Handle context node updates
  useEffect(() => {
    if (contextNodes && Array.isArray(contextNodes)) {
      console.log('Updating nodes with:', contextNodes);
      // Ensure each node has a valid position
      const validNodes = contextNodes.map((node, index) => {
        if (!node.position || !node.position.x || !node.position.y) {
          console.log('Node missing position:', node);
          return {
            ...node,
            position: {
              x: node.position?.x || 250,  // Fixed x position
              y: node.position?.y || index * 150  // Vertical spacing 
            }
          };
        }
        return node;
      });
      console.log('Setting nodes with:', validNodes);
      setNodes(validNodes);
    }
  }, [contextNodes]);

  // Handle node changes without triggering context updates unnecessarily
  const handleNodesChange = (changes) => {
    console.log('Canvas - Node changes:', changes);
    onNodesChange(changes);
    
    // Only update context for position changes
    if (changes.some(change => change.type === 'position')) {
      const updatedNodes = nodes.map(node => {
        const change = changes.find(c => c.id === node.id && c.type === 'position');
        return change ? { ...node, position: change.position } : node;
      });
      setContextNodes(updatedNodes);
    }
  };

  // Handle edge changes
  const handleEdgesChange = (changes) => {
    onEdgesChange(changes);
    setContextEdges(edges);
  };

  const onNodesDelete = (nodesToDelete) => {
    // Remove associated edges when nodes are deleted
    const nodeIds = new Set(nodesToDelete.map(node => node.id));
    setEdges(edges.filter(edge => 
      !nodeIds.has(edge.source) && !nodeIds.has(edge.target)
    ));
  };

  const onEdgesDelete = (edgesToDelete) => {
    const edgeIds = new Set(edgesToDelete.map(edge => edge.id));
    setEdges(edges.filter(edge => !edgeIds.has(edge.id)));
  };

  const onDragOver = (event) => {
    event.preventDefault();  // ✅ Allows dropping
    event.dataTransfer.dropEffect = "move"; // ✅ Shows move icon instead of 🚫
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
    const actionData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    // Get the position where the node was dropped
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };

    // Create the new node
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