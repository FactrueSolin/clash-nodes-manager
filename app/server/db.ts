import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CreateProxySchema } from '../api/[[...route]]/types';
const cfenv=getCloudflareContext().env  //避免使用env这个变量名，会和环境变量的env产生冲突

  const adapter = new PrismaD1(cfenv.DB)
    const prisma = new PrismaClient({ adapter })

export const db={
  createProxy,

}
async function createProxy(data:CreateProxySchema){
  const proxy = await prisma.proxy.create({
    data: {
      name: data.name,
      ip: data.ip,
      type: data.type,
      port: data.port,
      method: data.method,
      password: data.password
    }
  })
  return proxy
}