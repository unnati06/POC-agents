import { useAppContext } from "../store";

export function Sidebar() {
    const { actions } = useAppContext();
    
  
    return (

      <div className="bg-[#000000] flex flex-col  items-center h-screen w-3/2">
       <h3 className="mt-10 ml-10 text-2xl text-white mb-10">API Actions</h3>
        
        {actions.map((action) => (
          <div
            key={`${action.method}-${action.path}`} // Unique key
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify(action));
              e.dataTransfer.effectAllowed = "move";
            }} 
             className="flex p-2 mb-8 w-48  bg-[#000000] rounded-md cursor-grab userselect-none"
           
          >
            <div style={{ 
              display: 'flex', 
              gap: 8,
              alignItems: 'center'
            }}>
              {/* HTTP Method Badge */}
              <span
              className={`px-3 py-1 text-white text-xs font-bold uppercase rounded-md transition-all duration-300 shadow-md 
                ${
                  action.method === "get"
                    ? "bg-green-500 shadow-green-400/50 hover:shadow-green-500"
                    : action.method === "post"
                    ? "bg-blue-500 shadow-blue-400/50 hover:shadow-blue-500"
                    : action.method === "put"
                    ? "bg-orange-500 shadow-orange-400/50 hover:shadow-orange-500"
                    : "bg-red-500 shadow-red-400/50 hover:shadow-red-500"
                }`}
            >
              {action.method}
            </span>
            <span className="text-gray-300 text-sm font-medium transition-all duration-300 hover:text-white hover:shadow-[#00ffcc]/50">
              {action.path}
            </span>
            </div>
          </div>
        ))}
      
      </div>
    );
  }