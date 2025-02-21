// utils/openapi.js
import _ from 'lodash';


// Load and dereference the OpenAPI spec
import { parse } from 'yaml';

const url = '/mock-openapi.yaml';

export async function loadOpenAPISpec(url) {
  try {
    // 1. Fetch the YAML file
    const response = await fetch(url);
    console.log(response);
    const yamlText = await response.text();
    console.log(yamlText);
    
    // 2. Parse YAML to JS object
    const spec = parse(yamlText);
    
    return spec;
  } catch (error) {
    throw new Error(`Failed to load OpenAPI spec: ${error}`);
  }
}


// Extract actions from the OpenAPI spec
export function extractActions(spec) {
  const actions = [];

  // Iterate over all API paths
  _.forOwn(spec.paths, (pathItem, path) => {
    // Iterate over HTTP methods
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