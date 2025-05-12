import { collectAllProxies } from "@/app/server/checkUrl";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appenv } from "@/appenv";
import { db } from "@/app/server/db";
import { regionNameMap } from "@/app/server/area-name";
export default async function Dashboard() {
    const cookie=await cookies()
    
    if(cookie.get('key')?.value!==appenv.key){
      redirect('/login')
  
    }
    const ownProxis=await db.getProxys({})
  const urlProxies = await collectAllProxies();
  
  // 合并两个代理数组
  const allProxies = [
    ...(urlProxies.data || []).map(p => {
     
      const areaCode = p.name.match(/^([A-Z]{2})/)?.[1] || '';
      
      const displayName = regionNameMap[areaCode] ? `${regionNameMap[areaCode]}-${p.name}` : p.name;
      return {
        name: displayName,
        type: p.type,
        server: p.server,
        port: p.port
      };
    }),
    ...ownProxis.map(p => {
      
      const displayName = regionNameMap[p.area] ? `${regionNameMap[p.area]}-${p.name}` : p.name;
     
      return {
        name: displayName,
        type: p.type,
        server: p.ip,
        port: p.port
      };
    }),
    
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {allProxies.map((proxy, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm h-[110px] flex flex-col justify-center items-center">
          <h3 className="font-medium">{proxy.name}</h3>
          <p className="text-sm text-gray-500">{proxy.type}</p>
          <p className="text-sm">{(proxy.server + ':' + proxy.port).length > 20 ? (proxy.server + ':' + proxy.port).substring(0, 17) + '...' : proxy.server + ':' + proxy.port}</p>
        </div>
      ))}
    </div>
  )
}