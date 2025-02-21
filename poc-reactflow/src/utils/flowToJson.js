export function flowToAgentsJson(nodes, edges) {
    return {
      agents: nodes.map((node) => ({
        id: node.id,
        action: `${node.data.action.method.toUpperCase()} ${node.data.action.path}`,
        inputs: node.data.inputs,
        next: edges.find((e) => e.source === node.id)?.target || null
      }))
    };
  }