import Redis from "ioredis";
import { appenv } from "@/appenv";
const redis=new Redis({
    host:appenv.redis_host,
    port:appenv.redis_port,
    password:appenv.redis_password,
    db:appenv.redis_db,
})
export const kv={
    get,
    set,
    del,
}

async function set(key:string,value:string,expire:number=60*60*24){
    await redis.set(key,value,'EX',expire)
}

async function get(key:string){
    console.log('击中缓存')
    return await redis.get(key)
}
async function del(key:string){
    return await redis.del(key)
}