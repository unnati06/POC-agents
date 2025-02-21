
import _ from 'lodash';
import { parse } from 'yaml';

const url = '/mock-openapi.yaml';

export async function loadOpenAPISpec(url) {
  try {
    
    const response = await fetch(url);
    console.log(response);
    const yamlText = await response.text();
    console.log(yamlText);
    
    
    const spec = parse(yamlText);
    
    return spec;
  } catch (error) {
    throw new Error(`Failed to load OpenAPI spec: ${error}`);
  }
}



export function extractActions(spec) {
  const actions = [];

  
  _.forOwn(spec.paths, (pathItem, path) => {
    
    _.forOwn(pathItem, (methodItem, method) => {
      if (['get', 'post', 'put', 'delete'].includes(method)) {
        const action = {
          path,
          method,
          parameters: methodItem.parameters || [],
          requestSchema: methodItem.requestBody?.content?.['application/json']?.schema
        };
        actions.push(action);
      }
    });
  });

  return actions;
}

// module.exports = { loadOpenAPISpec, extractActions };