import { ClashConfigSchema } from '@/app/api/[[...route]]/types';
import { Proxy } from '@prisma/client';
import { exampleConfig } from '@/app/server/example-config';

export function generateFullConfig(data:Proxy[]): ClashConfigSchema {
  const baseConfig = exampleConfig;
  
  // 转换Proxy数据为Clash代理格式
  baseConfig.proxies = data.map(proxy => ({
    name: proxy.name,
    type: proxy.type,
    server: proxy.ip,
    port: proxy.port,
    cipher: proxy.method,
    password: proxy.password
  }));
  
  // 更新proxy-groups
  if (!baseConfig['proxy-groups']) {
    baseConfig['proxy-groups'] = [];
  }
  
  // 添加包含所有节点的自动选择组
  baseConfig['proxy-groups'].push({
    name: '自建节点',
    type: 'select',
    proxies: data.map(proxy => proxy.name),
  });
  
  // 更新rules
  if (!baseConfig.rules) {
    baseConfig.rules = [];
  }
  
  // 添加默认规则
  baseConfig.rules.push(
    'GEOIP,CN,DIRECT',
    'FINAL,自建节点'
  );
  
  return baseConfig;
}

