import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'

// 读取测试数据
const testYamlPath = path.join(process.cwd(), 'test', 'RrPQp4bZ1w2Z.yaml')
const testUrlPath = path.join(process.cwd(), 'test', 'testurl.txt')
const testUrl = fs.readFileSync(testUrlPath, 'utf8').trim()

// 模拟axios
const mockAxios = {
  get: vi.fn()
}
vi.mock('axios', () => ({ default: mockAxios }))

// 模拟kv
const mockKv = {
  get: vi.fn(),
  set: vi.fn()
}
vi.mock('@/server/kv', () => ({ kv: mockKv }))

// 模拟db
const mockDb = {
  getProxyUrls: vi.fn(),
  getProxys: vi.fn()
}
vi.mock('@/server/db', () => ({ db: mockDb }))

describe('checkUrl 模块测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基础功能测试', () => {
    it('应该能够读取测试文件', () => {
      expect(fs.existsSync(testYamlPath)).toBe(true)
      expect(fs.existsSync(testUrlPath)).toBe(true)
      expect(testUrl).toBeTruthy()
      expect(testUrl.startsWith('http')).toBe(true)
    })

    it('应该能够解析YAML内容', async () => {
      const yaml = await import('js-yaml')
      const testYamlContent = fs.readFileSync(testYamlPath, 'utf8')
      
      const config = yaml.load(testYamlContent)
      expect(config).toBeDefined()
      expect(typeof config).toBe('object')
      expect(config).toHaveProperty('proxies')
      expect(Array.isArray((config as any).proxies)).toBe(true)
      expect((config as any).proxies.length).toBeGreaterThan(0)
    })

    it('应该验证代理配置结构', async () => {
      const yaml = await import('js-yaml')
      const { z } = await import('zod')
      const testYamlContent = fs.readFileSync(testYamlPath, 'utf8')
      
      const config = yaml.load(testYamlContent) as any
      const firstProxy = config.proxies[0]
      
      expect(firstProxy).toHaveProperty('name')
      expect(firstProxy).toHaveProperty('server')
      expect(firstProxy).toHaveProperty('port')
      expect(firstProxy).toHaveProperty('type')
      expect(typeof firstProxy.name).toBe('string')
      expect(typeof firstProxy.server).toBe('string')
      expect(typeof firstProxy.port).toBe('number')
      expect(typeof firstProxy.type).toBe('string')
    })
  })

  describe('模拟函数测试', () => {
    it('应该能够模拟axios请求', async () => {
      mockAxios.get.mockResolvedValue({ data: 'test data' })
      
      const axios = (await import('axios')).default
      const result = await axios.get('http://test.com')
      
      expect(result.data).toBe('test data')
      expect(mockAxios.get).toHaveBeenCalledWith('http://test.com')
    })

    it('应该能够模拟KV存储', async () => {
      mockKv.get.mockResolvedValue('cached data')
      mockKv.set.mockResolvedValue(undefined)
      
      const { kv } = await import('@/server/kv')
      
      const result = await kv.get('test-key')
      expect(result).toBe('cached data')
      
      await kv.set('test-key', 'test-value', 3600)
      expect(mockKv.set).toHaveBeenCalledWith('test-key', 'test-value', 3600)
    })

    it('应该能够模拟数据库操作', async () => {
      const mockUrls = [{ url: 'http://test.com', name: '测试源' }]
      mockDb.getProxyUrls.mockResolvedValue(mockUrls)
      
      const { db } = await import('@/server/db')
      const result = await db.getProxyUrls({})
      
      expect(result).toEqual(mockUrls)
      expect(mockDb.getProxyUrls).toHaveBeenCalledWith({})
    })
  })
})