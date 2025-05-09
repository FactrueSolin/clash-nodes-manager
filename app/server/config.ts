import { ClashConfigSchema } from '@/app/api/[[...route]]/types';
import { Proxy } from '@prisma/client';
import { exampleConfig } from '@/app/server/example-config';
import { collectAllProxies } from './checkUrl';
export  async function  generateFullConfig(data:Proxy[]): Promise<ClashConfigSchema> {
  const baseConfig = exampleConfig;
  if (!baseConfig['proxy-groups']) {
    baseConfig['proxy-groups'] = [];
  }
  const clashUrlProxys=await collectAllProxies()
  
  // 转换Proxy数据为Clash代理格式
  
  baseConfig.proxies = data.map(proxy => ({
    name: `${proxy.area} - ${proxy.name}`,
    type: proxy.type,
    server: proxy.ip,
    port: proxy.port,
    cipher: proxy.method,
    password: proxy.password
  }));
  
  // 添加从URL收集的代理节点
  if (clashUrlProxys.data) {
    baseConfig.proxies.push(...clashUrlProxys.data.map(proxy => ({
      name: proxy.name,
      type: proxy.type,
      server: proxy.server,
      port: proxy.port,
      cipher: proxy.cipher,
      password: proxy.password,
      'client-fingerprint': proxy['client-fingerprint'],
      uuid: proxy.uuid,
      alterId: proxy.alterId,
      tls: proxy.tls,
      tfo: proxy.tfo,
      'skip-cert-verify': proxy['skip-cert-verify'],
      network: proxy.network,
      'ws-opts': proxy['ws-opts'],
      sni: proxy.sni,
      udp: proxy.udp
    })));
  }
  
  // 更新proxy-groups
  if (!baseConfig['proxy-groups']) {
    baseConfig['proxy-groups'] = [];
  }
  
  
  
  
  // 添加按地区代码分类的代理组
  const allProxies = [...data.map(proxy => `${proxy.area} - ${proxy.name}`), ...(clashUrlProxys.data?.map(p => p.name) || [])];
  const regionGroups = new Map<string, string[]>();
  
  // 正则匹配两位地区代码并分组
  const regionRegex = /\b([A-Za-z]{2})\b/;
  allProxies.forEach(proxyName => {
    const match = proxyName.match(regionRegex);
    if (match) {
      const regionCode = match[1].toUpperCase();
      if (!regionGroups.has(regionCode)) {
        regionGroups.set(regionCode, []);
      }
      regionGroups.get(regionCode)?.push(proxyName);
    }
  });
  
  // 地区代码到中文名称映射
  const regionNameMap: Record<string, string> = {
    'HK': '香港',
    'US': '美国',
    'JP': '日本',
    'SG': '新加坡',
    'TW': '台湾',
    'KR': '韩国',
    'UK': '英国',
    'DE': '德国',
    'FR': '法国',
    'CA': '加拿大',
    'AU': '澳大利亚'
  };

  // 为每个地区创建代理组
  regionGroups.forEach((proxies, regionCode) => {
    const regionName = regionNameMap[regionCode] || '未设定地区';
    baseConfig['proxy-groups']?.push({
      name: `地区-${regionName}`,
      type: 'url-test',
      proxies: proxies,
      interval: 300
    });
    
    // 更新PROXY组的代理列表
    const proxyGroup = baseConfig['proxy-groups']?.find(g => g.name === 'PROXY');
    if (proxyGroup) {
      const regionName = regionNameMap[regionCode] || '未设定地区';
      proxyGroup.proxies.push(`地区-${regionName}`);
    }
  });
  
  baseConfig['proxy-groups'] = [
    {
      name: '节点-自动选择',
      type: 'url-test',
      proxies: [...data.map(proxy => `${proxy.area} - ${proxy.name}`), ...(clashUrlProxys.data?.map(p => p.name) || [])],
      
      interval: 300
    },
    {
      name: '节点-手动选择',
      type: 'select',
      proxies: [...data.map(proxy => `${proxy.area} - ${proxy.name}`), ...(clashUrlProxys.data?.map(p => p.name) || [])]
    },
    {
      name: 'PROXY',
      type: 'select',
      proxies: baseConfig['proxy-groups']
        .filter(group => group.name !== 'PROXY')
        .map(group => group.name)
        .concat(['DIRECT'])
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

