import { kv } from './kv';
import { CreateProxySchema, UpdateProxySchema, DeleteProxySchema, GetProxySchema, CreateProxyUrlSchema, UpdateProxyUrlSchema, DeleteProxyUrlSchema, GetProxyUrlSchema } from '@/app/api/[[...route]]/types';

// 代理数据接口定义
interface ProxyData {
  id: string;
  name: string;
  area: string;
  ip: string;
  type: string;
  port: number;
  method: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// 代理URL数据接口定义
interface ProxyUrlData {
  uuid: string;
  name: string;
  url: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// KV存储键名常量
const PROXY_LIST_KEY = 'proxy_list';
const PROXY_URL_LIST_KEY = 'proxy_url_list';
const PROXY_KEY_PREFIX = 'proxy_';
const PROXY_URL_KEY_PREFIX = 'proxy_url_';

// 生成UUID的辅助函数
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 获取当前时间戳
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// 获取所有代理ID列表
async function getProxyIdList(): Promise<string[]> {
  const listData = await kv.get(PROXY_LIST_KEY);
  return listData ? JSON.parse(listData) : [];
}

// 更新代理ID列表
async function updateProxyIdList(ids: string[]): Promise<void> {
  await kv.set(PROXY_LIST_KEY, JSON.stringify(ids));
}

// 获取所有代理URL ID列表
async function getProxyUrlIdList(): Promise<string[]> {
  const listData = await kv.get(PROXY_URL_LIST_KEY);
  return listData ? JSON.parse(listData) : [];
}

// 更新代理URL ID列表
async function updateProxyUrlIdList(ids: string[]): Promise<void> {
  await kv.set(PROXY_URL_LIST_KEY, JSON.stringify(ids));
}

export const db = {
  createProxy: async (data: CreateProxySchema) => {
    return createProxy(data);
  },
  updateProxy: async (data: UpdateProxySchema) => {
    return updateProxy(data);
  },
  deleteProxy: async (data: DeleteProxySchema) => {
    return deleteProxy(data);
  },
  getProxys: async (data: GetProxySchema) => {
    return getProxys(data);
  },
  
  createProxyUrl: async (data: CreateProxyUrlSchema) => {
    return createProxyUrl(data);
  },
  updateProxyUrl: async (data: UpdateProxyUrlSchema) => {
    return updateProxyUrl(data);
  },
  deleteProxyUrl: async (data: DeleteProxyUrlSchema) => {
    return deleteProxyUrl(data);
  },
  getProxyUrls: async (data: GetProxyUrlSchema) => {
    return getProxyUrls(data);
  }
}

// 创建代理
async function createProxy(data: CreateProxySchema): Promise<ProxyData> {
  const id = generateUUID();
  const now = getCurrentTimestamp();
  
  const proxyData: ProxyData = {
    id,
    name: data.name,
    ip: data.ip,
    area: data.area,
    type: data.type,
    port: data.port,
    method: data.method || 'auto',
    password: data.password,
    status: true,
    createdAt: now,
    updatedAt: now
  };
  
  // 保存代理数据
  await kv.set(`${PROXY_KEY_PREFIX}${id}`, JSON.stringify(proxyData));
  
  // 更新代理ID列表
  const idList = await getProxyIdList();
  idList.push(id);
  await updateProxyIdList(idList);
  
  return proxyData;
}

// 更新代理
async function updateProxy(data: UpdateProxySchema): Promise<ProxyData | false> {
  const proxyKey = `${PROXY_KEY_PREFIX}${data.uuid}`;
  const existingData = await kv.get(proxyKey);
  
  if (!existingData) {
    return false;
  }
  
  const oldProxy: ProxyData = JSON.parse(existingData);
  const now = getCurrentTimestamp();
  
  const updatedProxy: ProxyData = {
    ...oldProxy,
    name: data.name || oldProxy.name,
    ip: data.ip || oldProxy.ip,
    area: data.area || oldProxy.area,
    type: data.type || oldProxy.type,
    port: data.port || oldProxy.port,
    method: data.method || oldProxy.method,
    password: data.password || oldProxy.password,
    updatedAt: now
  };
  
  await kv.set(proxyKey, JSON.stringify(updatedProxy));
  return updatedProxy;
}

// 删除代理
async function deleteProxy(data: DeleteProxySchema): Promise<ProxyData | false> {
  const proxyKey = `${PROXY_KEY_PREFIX}${data.uuid}`;
  const existingData = await kv.get(proxyKey);
  
  if (!existingData) {
    return false;
  }
  
  const proxyData: ProxyData = JSON.parse(existingData);
  
  // 删除代理数据
  await kv.del(proxyKey);
  
  // 从ID列表中移除
  const idList = await getProxyIdList();
  const updatedIdList = idList.filter(id => id !== data.uuid);
  await updateProxyIdList(updatedIdList);
  
  return proxyData;
}

// 获取代理列表
async function getProxys(data: GetProxySchema): Promise<ProxyData[]> {
  if (data.uuid) {
    // 获取单个代理
    const proxyData = await kv.get(`${PROXY_KEY_PREFIX}${data.uuid}`);
    return proxyData ? [JSON.parse(proxyData)] : [];
  }
  
  // 获取所有代理
  const idList = await getProxyIdList();
  const proxies: ProxyData[] = [];
  
  for (const id of idList) {
    const proxyData = await kv.get(`${PROXY_KEY_PREFIX}${id}`);
    if (proxyData) {
      proxies.push(JSON.parse(proxyData));
    }
  }
  
  return proxies;
}

// 创建代理URL
async function createProxyUrl(data: CreateProxyUrlSchema): Promise<ProxyUrlData> {
  const uuid = generateUUID();
  const now = getCurrentTimestamp();
  
  const proxyUrlData: ProxyUrlData = {
    uuid,
    name: data.name,
    url: data.url,
    status: true,
    createdAt: now,
    updatedAt: now
  };
  
  // 保存代理URL数据
  await kv.set(`${PROXY_URL_KEY_PREFIX}${uuid}`, JSON.stringify(proxyUrlData));
  
  // 更新代理URL ID列表
  const idList = await getProxyUrlIdList();
  idList.push(uuid);
  await updateProxyUrlIdList(idList);
  
  return proxyUrlData;
}

// 更新代理URL
async function updateProxyUrl(data: UpdateProxyUrlSchema): Promise<ProxyUrlData | false> {
  const proxyUrlKey = `${PROXY_URL_KEY_PREFIX}${data.uuid}`;
  const existingData = await kv.get(proxyUrlKey);
  
  if (!existingData) {
    return false;
  }
  
  const oldProxyUrl: ProxyUrlData = JSON.parse(existingData);
  const now = getCurrentTimestamp();
  
  const updatedProxyUrl: ProxyUrlData = {
    ...oldProxyUrl,
    name: data.name || oldProxyUrl.name,
    url: data.url || oldProxyUrl.url,
    updatedAt: now
  };
  
  await kv.set(proxyUrlKey, JSON.stringify(updatedProxyUrl));
  return updatedProxyUrl;
}

// 删除代理URL
async function deleteProxyUrl(data: DeleteProxyUrlSchema): Promise<ProxyUrlData | false> {
  const proxyUrlKey = `${PROXY_URL_KEY_PREFIX}${data.uuid}`;
  const existingData = await kv.get(proxyUrlKey);
  
  if (!existingData) {
    return false;
  }
  
  const proxyUrlData: ProxyUrlData = JSON.parse(existingData);
  
  // 删除缓存
  const cacheKey = `clash_config_${proxyUrlData.url}`;
  await kv.del(cacheKey);
  
  // 删除代理URL数据
  await kv.del(proxyUrlKey);
  
  // 从ID列表中移除
  const idList = await getProxyUrlIdList();
  const updatedIdList = idList.filter(id => id !== data.uuid);
  await updateProxyUrlIdList(updatedIdList);
  
  return proxyUrlData;
}

// 获取代理URL列表
async function getProxyUrls(data: GetProxyUrlSchema): Promise<ProxyUrlData[]> {
  if (data.uuid) {
    // 获取单个代理URL
    const proxyUrlData = await kv.get(`${PROXY_URL_KEY_PREFIX}${data.uuid}`);
    return proxyUrlData ? [JSON.parse(proxyUrlData)] : [];
  }
  
  // 获取所有代理URL
  const idList = await getProxyUrlIdList();
  const proxyUrls: ProxyUrlData[] = [];
  
  for (const id of idList) {
    const proxyUrlData = await kv.get(`${PROXY_URL_KEY_PREFIX}${id}`);
    if (proxyUrlData) {
      proxyUrls.push(JSON.parse(proxyUrlData));
    }
  }
  
  return proxyUrls;
}