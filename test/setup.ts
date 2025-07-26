// 测试环境设置文件
// 用于配置全局测试环境和模拟

import { vi } from 'vitest'

// 模拟环境变量
// 设置测试环境
if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: true
  });
}

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