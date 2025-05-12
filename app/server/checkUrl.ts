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
  cipher: z.string().optional().default('auto'),
  password: z.string().optional(),
  'client-fingerprint': z.string().optional(),
  uuid: z.string().optional(),
  alterId: z.number().optional(),
  tls: z.boolean().optional(),
  tfo: z.boolean().optional(),
  'skip-cert-verify': z.boolean().optional(),
  network: z.string().optional(),
  'ws-opts': z.union([
    z.string(),
    z.object({
      path: z.string().optional(),
      headers: z.record(z.string()).optional()
    })
  ]).optional(),
 
  udp: z.boolean().optional(),
  // VMess specific fields
  'ws-headers': z.record(z.string()).optional(),
  'h2-opts': z.object({
    host: z.array(z.string()).optional(),
    path: z.string().optional()
  }).optional(),
  'http-opts': z.object({
    method: z.string().optional(),
    path: z.array(z.string()).optional(),
    headers: z.record(z.array(z.string())).optional()
  }).optional(),
  // HTTP/Socks5 specific fields
  username: z.string().optional(),
  'sni': z.string().optional(),
  'alpn': z.array(z.string()).optional(),
  'servername': z.string().optional(),
  'disable-sni': z.boolean().optional(),
  'recv-window': z.number().optional(),
  'recv-window-conn': z.number().optional(),
  'reality-opts': z.object({
    'public-key': z.string(),
    'short-id': z.string().optional()
  }).optional(),
  // Shadowsocks specific fields
  'plugin': z.string().optional(),
  'plugin-opts': z.object({
    mode: z.string().optional(),
    host: z.string().optional()
  }).optional(),
  // ShadowsocksR specific fields
  'obfs': z.string().optional(),
  'protocol': z.string().optional(),
  'obfs-param': z.string().optional(),
  'protocol-param': z.string().optional(),
  // Snell specific fields
  'psk': z.string().optional(),
  'version': z.number().optional(),
  'obfs-opts': z.object({
    mode: z.string().optional(),
    host: z.string().optional()
  }).optional(),
  // Trojan specific fields
  'flow': z.string().optional()
}).passthrough();

const clashConfigSchema = z.object({
  proxies: z.array(ProxySchema).min(1),
  'proxy-groups': z.array(z.object({
    name: z.string(),
    type: z.enum(['select', 'relay', 'url-test', 'fallback', 'load-balance']),
    proxies: z.array(z.string()),
    // relay specific
    'disable-udp': z.boolean().optional().default(false),
    // url-test/fallback specific
    url: z.string().url().optional().default('http://www.gstatic.com/generate_204'),
    interval: z.number().int().min(60).optional().default(300),
    tolerance: z.number().int().min(0).optional().default(50),
    // load-balance specific
    'persistent': z.boolean().optional().default(false),
    'persistent-timeout': z.number().int().min(1).optional().default(5),
    // interface selection
    'interface-name': z.string().optional().default('')
  })).optional(),
  rules: z.array(z.string()).optional()
}).passthrough();
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
    
    // 检测是否为base64编码内容
    let configData = response.data;
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(configData.trim())) {
      configData = Buffer.from(configData, 'base64').toString('utf8');
      return {
        state: false,
        message: '暂不支持uft-8编码的配置文件',
      }
    }
   
    
    const config = yaml.load(configData);
    
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