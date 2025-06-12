import { getCloudflareContext } from "@opennextjs/cloudflare";

export const kv={
    get,
    set,
    del,
}

function initKv() {
    const cfenv=getCloudflareContext().env;
    const kv=cfenv.kv;
    return kv;
    
}

async function set(key:string,value:string,expire:number=60*60*24){
    const redis=initKv()
    await redis.put(key,value,{expirationTtl: expire})
}

async function get(key:string){
    const redis=initKv()
    
    return await redis.get(key)
}
async function del(key:string){
    const redis=initKv()
    return await redis.delete(key)
}