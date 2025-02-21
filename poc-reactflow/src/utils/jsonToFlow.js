export function jsonToFlow(jsonData) {
  console.log('jsonToFlow received:', jsonData);

  if (!jsonData?.agents || !Array.isArray(jsonData.agents)) {
    console.log('Invalid JSON data - returning empty nodes/edges');
    return { nodes: [], edges: [] };
  }

  const nodes = jsonData.agents.map((agent, index) => ({
    id: agent.id,
    type: 'default', 
    position: {
      x:250,
      y: index * 150
    },
    data: {
      label: agent.action,
      action: {
        method: agent.action.split(' ')[0].toLowerCase(),
        path: agent.action.split(' ')[1]
      },
      inputs: agent.inputs || {}
    }
  }));

  const edges = jsonData.agents
    .filter(agent => agent.next)
    .map(agent => ({
      id: `${agent.id}-${agent.next}`,
      source: agent.id,
      target: agent.next,
      type:'smoothstep'
    }));

  console.log('jsonToFlow produced nodes:', nodes);
  console.log('jsonToFlow produced edges:', edges);

  return { nodes, edges };
} 