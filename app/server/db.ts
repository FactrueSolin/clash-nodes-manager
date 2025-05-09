import { PrismaClient } from '@prisma/client'

import { CreateProxySchema,UpdateProxySchema,DeleteProxySchema,GetProxySchema,CreateProxyUrlSchema,UpdateProxyUrlSchema,DeleteProxyUrlSchema,GetProxyUrlSchema } from '@/app/api/[[...route]]/types';
let prisma: PrismaClient;

async function initPrisma() {
  
  prisma = new PrismaClient();
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
  initPrisma,
  createProxyUrl: async (data: CreateProxyUrlSchema) => {
    await db.ensureInitialized();
    return createProxyUrl(data);
  },
  updateProxyUrl: async (data: UpdateProxyUrlSchema) => {
    await db.ensureInitialized();
    return updateProxyUrl(data);
  },
  deleteProxyUrl: async (data: DeleteProxyUrlSchema) => {
    await db.ensureInitialized();
    return deleteProxyUrl(data);
  },
  getProxyUrls: async (data: GetProxyUrlSchema) => {
    await db.ensureInitialized();
    return getProxyUrls(data);
  }
}
async function createProxy(data:CreateProxySchema){
  
  const proxy = await prisma.proxy.create({
    data: {
      name: data.name,
      ip: data.ip,
      area:data.area,
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
      area:data.area,
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

async function createProxyUrl(data:CreateProxyUrlSchema){
  const proxyUrl = await prisma.proxyUrl.create({
    data: {
      name: data.name,
      url: data.url
    }
  })
  return proxyUrl
}

async function updateProxyUrl(data:UpdateProxyUrlSchema) {
  const oldProxyUrl = await prisma.proxyUrl.findUnique({
    where: { uuid: data.uuid }
  })
  if (!oldProxyUrl) {
    return false
  }
  const proxyUrl = await prisma.proxyUrl.update({
    where: { uuid: data.uuid },
    data: {
      name: data.name,
      url: data.url
    }
  })
  return proxyUrl
}

async function deleteProxyUrl(data:DeleteProxyUrlSchema) {
  const oldProxyUrl = await prisma.proxyUrl.findUnique({
    where: { uuid: data.uuid }
  })
  if (!oldProxyUrl) {
    return false
  }
  const proxyUrl = await prisma.proxyUrl.delete({
    where: { uuid: data.uuid }
  })
  return proxyUrl
}

async function getProxyUrls(data:GetProxyUrlSchema) {
  
  const proxyUrls = await prisma.proxyUrl.findMany({
    where: { uuid: data.uuid }
  })
  return proxyUrls
}