'use server'
import { db } from "@/app/server/db";
import DeleteProxyButton from "@/app/commont/DeleteProxyButton";
import CreateProxyForm from "@/app/commont/CreateProxyForm";
import UpdateProxyForm from "@/app/commont/UpdateProxyForm";
export default async function Proxys() {
    
  const  data  = await db.getProxys({});
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-6 max-w-7xl flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">节点列表</h1>
          <CreateProxyForm />
        </div>
        <div className="grid grid-cols-1 gap-6">
        {data.map((proxy) => (
          <div key={proxy.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300 w-full">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{proxy.name}</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="text-gray-600"><span className="font-medium">类型:</span> {proxy.type}</p>
                  <p className="text-gray-600"><span className="font-medium">IP:</span> {proxy.ip}</p>
                  <p className="text-gray-600"><span className="font-medium">端口:</span> {proxy.port}</p>
                  <p className="text-gray-600"><span className="font-medium">状态:</span> 
                    <span className={`px-2 py-1 rounded ${proxy.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {proxy.status ? '启用' : '禁用'}
                    </span>
                  </p>
                </div>
                <p className="text-gray-500 text-sm">更新时间: {new Date(proxy.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <UpdateProxyForm proxy={proxy} />
                <DeleteProxyButton uuid={proxy.id} />
              
            </div>
            </div>                
           
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}