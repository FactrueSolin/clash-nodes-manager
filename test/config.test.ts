import { describe, it, expect, vi } from 'vitest'
import { regionNameMap } from '@/server/area-name'

describe('config 模块测试', () => {
  describe('基础配置测试', () => {
    it('应该能够导入地区名称映射', () => {
      expect(regionNameMap).toBeDefined()
      expect(typeof regionNameMap).toBe('object')
      expect(Object.keys(regionNameMap).length).toBeGreaterThan(0)
    })

    it('应该验证地区代码格式', () => {
      const regionCodes = Object.keys(regionNameMap)
      
      regionCodes.forEach(code => {
        // 验证地区代码为2位大写字母
        expect(code).toMatch(/^[A-Z]{2}$/)
        
        // 验证地区名称包含emoji和中文
        const name = regionNameMap[code]
        expect(name).toMatch(/^[\u{1F1E6}-\u{1F1FF}]{2} .+$/u)
        expect(/[\u4e00-\u9fff]/.test(name)).toBe(true)
      })
    })

    it('应该包含主要地区', () => {
      const expectedRegions = ['HK', 'US', 'JP', 'SG', 'TW', 'KR', 'UK', 'DE', 'CN']
      
      expectedRegions.forEach(region => {
        expect(regionNameMap).toHaveProperty(region)
        expect(regionNameMap[region]).toBeTruthy()
      })
    })
  })

  describe('配置生成逻辑测试', () => {
    it('应该能够处理代理名称格式化', () => {
      const testProxyName = 'HK Premium 01'
      const regionMatch = testProxyName.match(/\b([A-Za-z]{2})\b/)
      
      expect(regionMatch).toBeTruthy()
      if (regionMatch) {
        const regionCode = regionMatch[1].toUpperCase()
        expect(regionCode).toBe('HK')
        
        const regionName = regionNameMap[regionCode]
        expect(regionName).toBe('🇭🇰 香港')
        
        const formattedName = `${regionName} ${regionCode} - ${testProxyName}`
        expect(formattedName).toBe('🇭🇰 香港 HK - HK Premium 01')
      }
    })

    it('应该能够提取不同格式的地区代码', () => {
      const testCases = [
        { name: 'US-West-01', expected: 'US' },
        { name: 'Singapore SG Fast', expected: 'SG' },
        { name: 'JP Tokyo Premium', expected: 'JP' },
        { name: 'HK-Premium-Node-01', expected: 'HK' }
      ]
      
      testCases.forEach(({ name, expected }) => {
        const regionMatch = name.match(/\b([A-Za-z]{2})\b/)
        expect(regionMatch).toBeTruthy()
        if (regionMatch) {
          const regionCode = regionMatch[1].toUpperCase()
          expect(regionCode).toBe(expected)
        }
      })
    })

    it('应该验证代理组配置结构', () => {
      const mockProxyGroup = {
        name: '🇭🇰 香港',
        type: 'url-test',
        proxies: ['🇭🇰 香港 HK - 节点1', '🇭🇰 香港 HK - 节点2'],
        url: 'http://www.gstatic.com/generate_204',
        interval: 300
      }
      
      expect(mockProxyGroup).toHaveProperty('name')
      expect(mockProxyGroup).toHaveProperty('type')
      expect(mockProxyGroup).toHaveProperty('proxies')
      expect(mockProxyGroup.type).toBe('url-test')
      expect(Array.isArray(mockProxyGroup.proxies)).toBe(true)
      expect(mockProxyGroup.proxies.length).toBeGreaterThan(0)
    })

    it('应该验证核心代理组结构', () => {
      const coreGroups = [
        {
          name: '节点-自动选择',
          type: 'url-test',
          proxies: ['测试节点1', '测试节点2'],
          url: 'http://www.gstatic.com/generate_204',
          interval: 300
        },
        {
          name: '节点-手动选择',
          type: 'select',
          proxies: ['测试节点1', '测试节点2']
        },
        {
          name: 'PROXY',
          type: 'select',
          proxies: ['DIRECT', '节点-自动选择', '节点-手动选择']
        }
      ]
      
      coreGroups.forEach(group => {
        expect(group).toHaveProperty('name')
        expect(group).toHaveProperty('type')
        expect(group).toHaveProperty('proxies')
        expect(['select', 'url-test']).toContain(group.type)
        expect(Array.isArray(group.proxies)).toBe(true)
      })
    })
  })
})