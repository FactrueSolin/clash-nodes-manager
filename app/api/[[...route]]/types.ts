import { z } from 'zod'

export const createProxySchema = z.object({
  key: z.coerce.string().min(1, { message: '服务调用权杖必须提供' }),
  name: z.coerce.string().min(1, { message: '节点名称必须提供' }),
  ip: z.coerce.string().ip({ version: 'v4', message: '必须提供有效的IPv4地址' }),
  type: z.coerce.string().min(1, { message: '协议类型必须提供' }),
  port: z.coerce.number().int().min(1).max(65535, { message: '端口必须在1-65535范围内' }),
  method: z.coerce.string().min(1, { message: '加密方式必须提供' }),
  password: z.coerce.string().min(1, { message: '连接密码必须提供' })
})

export type CreateProxySchema = z.infer<typeof createProxySchema>