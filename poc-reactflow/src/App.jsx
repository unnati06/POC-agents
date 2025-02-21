import Canvas from './components/Canvas';
import { loadOpenAPISpec } from './utils/openapi';
import { useState, useEffect } from 'react';
import { useAppContext } from './store';
import { JsonEditor } from './components/JsonEditor';
function App(){
  const { loadSpec } = useAppContext();

  useEffect(() => {
    // Replace with your actual OpenAPI spec URL
    loadSpec('/mock-openapi.yaml');
  }, []);
  return(
    <div className="h-screen w-full flex">

    <div className="flex-1 h-full">
      <Canvas />
    </div>


    <div className="w-96 h-80 border-l">
      <JsonEditor />
    </div>
  </div>
  )
}




export default App