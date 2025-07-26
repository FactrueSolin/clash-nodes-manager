import { getCloudflareContext } from "@opennextjs/cloudflare";

export const kv={
    get,
    set,
    del,
}

async function initKv() {
    const cfenv = (await getCloudflareContext({ async: true })).env;
    const kv = cfenv.kv;
    return kv;
}

async function set(key:string,value:string,expire:number=60*60*24): Promise<void> {
    const redis = await initKv();
    await redis.put(key,value,{expirationTtl: expire});
}

async function get(key:string): Promise<string | null> {
    const redis = await initKv();
    return await redis.get(key);
}

async function del(key:string): Promise<void> {
    const redis = await initKv();
    await redis.delete(key);
}