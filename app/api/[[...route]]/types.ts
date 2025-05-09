import { z } from 'zod'

export const createProxySchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  name: z.coerce.string().min(1, { message: '节点名称必须提供' }),
  area: z.coerce.string().length(2, { message: '地区必须为2位' }),
  ip: z.coerce.string().ip({ version: 'v4', message: '必须提供有效的IPv4地址' }),
  type: z.coerce.string().min(1, { message: '协议类型必须提供' }),
  port: z.coerce.number().int().min(1).max(65535, { message: '端口必须在1-65535范围内' }),
  method: z.coerce.string().min(1, { message: '加密方式必须提供' }),
  password: z.coerce.string().min(1, { message: '连接密码必须提供' })
})

export const updateProxySchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  uuid: z.coerce.string().min(1, { message: '节点ID必须提供' }),
  name: z.coerce.string().optional(),
  area: z.coerce.string().length(2, { message: '地区必须为2位' }).optional(),
  ip: z.coerce.string().ip({ version: 'v4', message: '必须提供有效的IPv4地址' }).optional(),
  type: z.coerce.string().min(1, { message: '协议类型必须提供' }).optional(),
  port: z.coerce.number().int().min(1).max(65535, { message: '端口必须在1-65535范围内' }).optional(),
  method: z.coerce.string().min(1, { message: '加密方式必须提供' }).optional(),
  password: z.coerce.string().min(1, { message: '连接密码必须提供' }).optional()
})

export const deleteProxySchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  uuid: z.coerce.string().min(1, { message: '节点ID必须提供' })
})

export const getProxySchema = z.object({

  uuid: z.coerce.string().min(1, { message: '节点ID不正确' }).optional()
})

export type CreateProxySchema = z.infer<typeof createProxySchema>
export type UpdateProxySchema = z.infer<typeof updateProxySchema>
export type DeleteProxySchema = z.infer<typeof deleteProxySchema>
export type GetProxySchema = z.infer<typeof getProxySchema>

export const clashConfigSchema = z.object({
  port: z.number().int().min(1).max(65535),
  'socksport': z.number().int().min(1).max(65535),
  'allow-lan': z.boolean(),
  mode: z.string(),
  'log-level': z.string(),
  'external-controller': z.string(),
  dns: z.object({
    enable: z.boolean(),
    nameserver: z.array(z.string().ip()),
    fallback: z.array(z.string())
  }),
  proxies: z.array(z.object({
    name: z.string(),
    type: z.string(),
    server: z.string(),
    port: z.number(),
    cipher: z.string().optional(),
    password: z.string().optional(),
    udp: z.boolean().optional()
  })).optional(),
  'proxy-groups': z.array(z.object({
    name: z.string(),
    type: z.enum(['select', 'url-test', 'fallback', 'load-balance']),
    proxies: z.array(z.string()),
    url: z.string().optional(),
    interval: z.number().optional(),
  })).optional(),
  'rule-providers': z.record(z.object({
    type: z.string(),
    behavior: z.string(),
    url: z.string(),
    path: z.string(),
    interval: z.number()
  })).optional(),
  rules: z.array(z.string()).optional()
})

export type ClashConfigSchema = z.infer<typeof clashConfigSchema>

export const createProxyUrlSchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  name: z.coerce.string().min(1, { message: '配置名称必须提供' }),
  url: z.coerce.string().url({ message: '必须提供有效的URL地址' }),
  status: z.coerce.boolean().optional().default(true)
})

export const updateProxyUrlSchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  uuid: z.coerce.string().min(1, { message: '配置文件ID必须提供' }),
  name: z.coerce.string().min(1, { message: '配置名称必须提供' }).optional(),
  url: z.coerce.string().url({ message: '必须提供有效的URL地址' }).optional(),
  status: z.coerce.boolean().optional()
})

export const deleteProxyUrlSchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  uuid: z.coerce.string().min(1, { message: '配置文件ID必须提供' })
})

export const getProxyUrlSchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }).optional(),
  uuid: z.coerce.string().min(1, { message: '配置文件ID不正确' }).optional()
})

export type CreateProxyUrlSchema = z.infer<typeof createProxyUrlSchema>
export type UpdateProxyUrlSchema = z.infer<typeof updateProxyUrlSchema>
export type DeleteProxyUrlSchema = z.infer<typeof deleteProxyUrlSchema>
export type GetProxyUrlSchema = z.infer<typeof getProxyUrlSchema>
