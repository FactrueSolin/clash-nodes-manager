import yaml from 'js-yaml';
import axios from 'axios';
import { z } from 'zod';
import { db } from './db';
import { kv } from './kv';
const ProxySchema = z.object({
  name: z.string(),
  type: z.string(),
  server: z.string(),
  port: z.number(),
  cipher: z.string().optional(),
  password: z.string().optional(),
  'client-fingerprint': z.string().optional(),
  uuid: z.string().optional(),
  alterId: z.number().optional(),
  tls: z.boolean().optional(),
  tfo: z.boolean().optional(),
  'skip-cert-verify': z.boolean().optional(),
  network: z.string().optional(),
  'ws-opts': z.object({
    path: z.string().optional(),
    headers: z.record(z.string()).optional()
  }).optional(),
  sni: z.string().optional(),
  udp: z.boolean().optional()
});

const clashConfigSchema = z.object({
  proxies: z.array(ProxySchema).min(1),
  'proxy-groups': z.array(z.object({
    name: z.string(),
    type: z.string(),
    proxies: z.array(z.string())
  })).optional(),
  rules: z.array(z.string()).optional()
});
type ClashConfigSchema = z.infer<typeof clashConfigSchema>

export async function getProxysByUrl(url: string): Promise<{state: boolean, message: string, data?:ClashConfigSchema }> {
  try {
    // 下载配置文件
   
    const cacheKey=`clash_config_${url}`;
    const cacheData=await kv.get(cacheKey);
    if(cacheData){
      return {
        state: true,
        message: '配置验证成功',
        data: JSON.parse(cacheData)
      };
    }
    const response = await axios.get(url);
    const config = yaml.load(response.data);
    
    // 使用zod验证配置结构
    const result = clashConfigSchema.safeParse(config);
    if (result.success) {
      await kv.set(cacheKey,JSON.stringify(result.data),60*60*24);
      return {
        state: true,
        message: '配置验证成功',
        data: result.data
      };
    } else {
      return {
        state: false,
        message: '配置验证失败: ' + JSON.stringify(result.error.format())
      };
    }
  } catch (error) {
    return {
      state: false,
      message: '配置检查出错: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}



export async function collectAllProxies(): Promise<{
  state: boolean;
  message: string;
  data?: z.infer<typeof ProxySchema>[];
}> {
  try {
    const proxyUrls = await db.getProxyUrls({});
    const allProxies: z.infer<typeof ProxySchema>[] = [];
    

    for (const url of proxyUrls) {
      const result = await getProxysByUrl(url.url);
      if (result.state && result.data?.proxies && result.data.proxies.length > 0) {
        const modifiedProxies = result.data.proxies.map(proxy => ({
          ...proxy,
          name: `${proxy.name} - ${url.name}`
        }));
        allProxies.push(...modifiedProxies);
      }
    }
    

    return {
      state: true,
      message: '成功收集所有代理节点',
      data: allProxies
    };
  } catch (error) {
    console.error('收集所有代理节点时出错:', error);
    return {
      state: false,
      message: '收集代理节点时出错: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}