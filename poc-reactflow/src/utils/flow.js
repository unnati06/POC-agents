// utils/flowUtils.js
export function actionsToNodes(actions) {
    return actions.map((action, index) => ({
      id: `node-${index}`,
      type: 'apiAction',
      position: { x: 0, y: index * 100 },
      data: {
        label: `${action.method.toUpperCase()} ${action.path}`,
        action,
        inputs: {}
      }
    }));
  }
  
//   module.exports = { actionsToNodes };