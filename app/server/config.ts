import { ClashConfigSchema } from '@/app/api/[[...route]]/types';
import { Proxy } from '@prisma/client';
import { exampleConfig } from '@/app/server/example-config';

export function generateFullConfig(data:Proxy[]): ClashConfigSchema {
  const baseConfig = exampleConfig;
  
  // 转换Proxy数据为Clash代理格式
  
  baseConfig.proxies = data.map(proxy => ({
    name: `${proxy.area} - ${proxy.name}`,
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
  
  // 检查是否已存在'自建节点'组，不存在则添加
  baseConfig['proxy-groups'] = [
    {
      name: '节点-自动选择',
      type: 'url-test',
      proxies: data.map(proxy => `${proxy.area} - ${proxy.name}`),
      
      interval: 300
    },
    {
      name: '节点-手动选择',
      type: 'select',
      proxies: data.map(proxy => `${proxy.area} - ${proxy.name}`)
    },
    {
      name: 'PROXY',
      type: 'select',
      proxies: ['节点-自动选择', '节点-手动选择', 'DIRECT']
    }
  ];
  
  // 更新rules
  if (!baseConfig.rules) {
    baseConfig.rules = [];
  }
  
  // 添加规则提供者和规则集
  baseConfig['rule-providers'] = {
    reject: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
      path: './ruleset/reject.yaml',
      interval: 86400
    },
    icloud: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt',
      path: './ruleset/icloud.yaml',
      interval: 86400
    },
    apple: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt',
      path: './ruleset/apple.yaml',
      interval: 86400
    },
    google: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
      path: './ruleset/google.yaml',
      interval: 86400
    },
    proxy: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
      path: './ruleset/proxy.yaml',
      interval: 86400
    },
    direct: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
      path: './ruleset/direct.yaml',
      interval: 86400
    },
    private: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
      path: './ruleset/private.yaml',
      interval: 86400
    },
    gfw: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
      path: './ruleset/gfw.yaml',
      interval: 86400
    },
    tldNotCn: {
      type: 'http',
      behavior: 'domain',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
      path: './ruleset/tld-not-cn.yaml',
      interval: 86400
    },
    telegramcidr: {
      type: 'http',
      behavior: 'ipcidr',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
      path: './ruleset/telegramcidr.yaml',
      interval: 86400
    },
    cncidr: {
      type: 'http',
      behavior: 'ipcidr',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
      path: './ruleset/cncidr.yaml',
      interval: 86400
    },
    lancidr: {
      type: 'http',
      behavior: 'ipcidr',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
      path: './ruleset/lancidr.yaml',
      interval: 86400
    },
    applications: {
      type: 'http',
      behavior: 'classical',
      url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt',
      path: './ruleset/applications.yaml',
      interval: 86400
    }
  };

  // 添加白名单模式规则
  baseConfig.rules = [
    'RULE-SET,applications,DIRECT',
    'DOMAIN,clash.razord.top,DIRECT',
    'DOMAIN,yacd.haishan.me,DIRECT',
    'RULE-SET,private,DIRECT',
    'RULE-SET,reject,REJECT',
    'RULE-SET,icloud,DIRECT',
    'RULE-SET,apple,DIRECT',
    'RULE-SET,google,PROXY',
    'RULE-SET,proxy,PROXY',
    'RULE-SET,direct,DIRECT',
    'RULE-SET,lancidr,DIRECT',
    'RULE-SET,cncidr,DIRECT',
    'RULE-SET,telegramcidr,PROXY',
    'GEOIP,LAN,DIRECT',
    'GEOIP,CN,DIRECT',
    'MATCH,PROXY'
  ];
  
  return baseConfig;
}

