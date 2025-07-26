// 测试环境设置文件
// 用于配置全局测试环境和模拟

import { vi } from 'vitest'

// 模拟环境变量
process.env.NODE_ENV = 'test'

// 模拟数据库连接
vi.mock('@/server/db', () => ({
  db: {
    getProxyUrls: vi.fn(),
    getProxys: vi.fn(),
  }
}))

// 模拟KV存储
vi.mock('@/server/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
  }
}))

// 模拟axios请求
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  }
}))

// 模拟collectAllProxies函数
vi.mock('@/server/checkUrl', async () => {
  const actual = await vi.importActual('@/server/checkUrl')
  return {
    ...actual,
    collectAllProxies: vi.fn(),
  }
})