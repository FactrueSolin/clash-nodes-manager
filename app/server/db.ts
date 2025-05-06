import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CreateProxySchema,UpdateProxySchema,DeleteProxySchema,GetProxySchema } from '@/app/api/[[...route]]/types';
let prisma: PrismaClient;

async function initPrisma() {
  const cfenv = (await getCloudflareContext({async:true})).env;
  const adapter = new PrismaD1(cfenv.DB);
  prisma = new PrismaClient({ adapter });
}
let initialized = false;
let initError: Error | null = null;

export const db = {
  async ensureInitialized() {
    if (initialized) return;
    if (initError) throw initError;
    
    try {
      await initPrisma();
      initialized = true;
    } catch (err) {
      initError = err as Error;
      throw initError;
    }
  },
  createProxy: async (data: CreateProxySchema) => {
    await db.ensureInitialized();
    return createProxy(data);
  },
  updateProxy: async (data: UpdateProxySchema) => {
    await db.ensureInitialized();
    return updateProxy(data);
  },
  deleteProxy: async (data: DeleteProxySchema) => {
    await db.ensureInitialized();
    return deleteProxy(data);
  },
  getProxys: async (data: GetProxySchema) => {
    await db.ensureInitialized();
    return getProxys(data);
  },
  initPrisma
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

async function updateProxy(data:UpdateProxySchema) {
  const oldProxy = await prisma.proxy.findUnique({
    where: { id: data.uuid }
  })
  if (!oldProxy) {
    return false
  }
  const proxy = await prisma.proxy.update({
    where: { id: data.uuid },
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
async function deleteProxy(data:DeleteProxySchema) {
  const oldProxy = await prisma.proxy.findUnique({
    where: { id: data.uuid }
  })
  if (!oldProxy) {
    return false
  }
  const proxy = await prisma.proxy.delete({
    where: { id: data.uuid }
  })
  return proxy
}

async function getProxys(data:GetProxySchema) {
  const proxys = await prisma.proxy.findMany({
    where: { id: data.uuid }
  })
  return proxys
}