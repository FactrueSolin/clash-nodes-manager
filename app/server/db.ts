import { kv } from './kv';
import { CreateProxySchema,UpdateProxySchema,DeleteProxySchema,GetProxySchema,CreateProxyUrlSchema,UpdateProxyUrlSchema,DeleteProxyUrlSchema,GetProxyUrlSchema } from '@/app/api/[[...route]]/types';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { proxy, proxyUrl } from '../db/scheme';
import { eq } from 'drizzle-orm';

let dbInstance: ReturnType<typeof drizzle>;

async function initDrizzle() {
  const cfenv = (await getCloudflareContext({ async: true })).env;
  dbInstance = drizzle(cfenv.DB);
}
let initialized = false;
let initError: Error | null = null;

export const db = {
  async ensureInitialized() {
    if (initialized) return;
    if (initError) throw initError;
    
    try {
      await initDrizzle();
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
  await db.ensureInitialized();
  const result = await dbInstance.insert(proxy).values({
    name: data.name,
    ip: data.ip,
    area: data.area,
    type: data.type,
    port: data.port,
    method: data.method,
    password: data.password
  }).returning();
  return result[0];
}

async function updateProxy(data:UpdateProxySchema) {
  await db.ensureInitialized();
  const oldProxy = await dbInstance.select().from(proxy).where(eq(proxy.id, data.uuid));
  if (!oldProxy.length) {
    return false;
  }
  const result = await dbInstance.update(proxy)
    .set({
      name: data.name,
      ip: data.ip,
      area: data.area,
      type: data.type,
      port: data.port,
      method: data.method,
      password: data.password
    })
    .where(eq(proxy.id, data.uuid))
    .returning();
  return result[0];
}
async function deleteProxy(data:DeleteProxySchema) {
  await db.ensureInitialized();
  const oldProxy = await dbInstance.select().from(proxy).where(eq(proxy.id, data.uuid));
  if (!oldProxy.length) {
    return false;
  }
  const result = await dbInstance.delete(proxy)
    .where(eq(proxy.id, data.uuid))
    .returning();
  return result[0];
}

async function getProxys(data:GetProxySchema) {
  await db.ensureInitialized();
  const result = await dbInstance.select()
    .from(proxy)
    .where(data.uuid ? eq(proxy.id, data.uuid) : undefined);
  return result;
}

async function createProxyUrl(data:CreateProxyUrlSchema){
  await db.ensureInitialized();
  const result = await dbInstance.insert(proxyUrl).values({
    name: data.name,
    url: data.url
  }).returning();
  return result[0];
}

async function updateProxyUrl(data:UpdateProxyUrlSchema) {
  await db.ensureInitialized();
  const oldProxyUrl = await dbInstance.select().from(proxyUrl).where(eq(proxyUrl.uuid, data.uuid));
  if (!oldProxyUrl.length) {
    return false;
  }
  const result = await dbInstance.update(proxyUrl)
    .set({
      name: data.name,
      url: data.url
    })
    .where(eq(proxyUrl.uuid, data.uuid))
    .returning();
  return result[0];
}

async function deleteProxyUrl(data:DeleteProxyUrlSchema) {
  await db.ensureInitialized();
  const oldProxyUrl = await dbInstance.select().from(proxyUrl).where(eq(proxyUrl.uuid, data.uuid));
  if (!oldProxyUrl.length) {
    return false;
  }
  const cacheKey=`clash_config_${oldProxyUrl[0].url}`;
  await kv.del(cacheKey);
  const result = await dbInstance.delete(proxyUrl)
    .where(eq(proxyUrl.uuid, data.uuid))
    .returning();
  return result[0];
}

async function getProxyUrls(data:GetProxyUrlSchema) {
  await db.ensureInitialized();
  const result = await dbInstance.select()
    .from(proxyUrl)
    .where(data.uuid ? eq(proxyUrl.uuid, data.uuid) : undefined);
  return result;
}