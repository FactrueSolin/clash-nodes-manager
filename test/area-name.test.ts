import { describe, it, expect } from 'vitest'
import { regionNameMap } from '../app/server/area-name'

describe('area-name 模块测试', () => {
  describe('regionNameMap 地区名称映射测试', () => {
    it('应该包含常用地区代码', () => {
      // 测试主要地区代码是否存在
      const commonRegions = ['HK', 'US', 'JP', 'SG', 'TW', 'KR', 'UK', 'DE', 'FR', 'CA']
      
      commonRegions.forEach(region => {
        expect(regionNameMap).toHaveProperty(region)
        expect(typeof regionNameMap[region]).toBe('string')
        expect(regionNameMap[region].length).toBeGreaterThan(0)
      })
    })

    it('应该返回正确的地区名称格式', () => {
      // 测试香港地区
      expect(regionNameMap['HK']).toBe('🇭🇰 香港')
      
      // 测试美国地区
      expect(regionNameMap['US']).toBe('🇺🇸 美国')
      
      // 测试日本地区
      expect(regionNameMap['JP']).toBe('🇯🇵 日本')
      
      // 测试新加坡地区
      expect(regionNameMap['SG']).toBe('🇸🇬 新加坡')
    })

    it('应该包含国旗emoji和中文名称', () => {
      Object.values(regionNameMap).forEach(regionName => {
        // 检查是否包含emoji（通过检查是否包含非ASCII字符）
        expect(/[\u{1F1E6}-\u{1F1FF}]/u.test(regionName as string)).toBe(true)
        
        // 验证包含中文字符
        expect(/[\u4e00-\u9fff]/.test(regionName as string)).toBe(true)
        
        // 检查格式是否为 "🏳️ 地区名称"
        expect(regionName).toMatch(/^[\u{1F1E6}-\u{1F1FF}]{2} .+$/u)
      })
    })

    it('应该包含所有预期的地区数量', () => {
      // 验证地区映射表包含足够的地区
      expect(Object.keys(regionNameMap).length).toBeGreaterThan(50)
    })

    it('应该处理大小写敏感的地区代码', () => {
      // 测试大写地区代码
      expect(regionNameMap['HK']).toBeDefined()
      expect(regionNameMap['US']).toBeDefined()
      
      // 测试小写地区代码（应该不存在）
      expect(regionNameMap['hk']).toBeUndefined()
      expect(regionNameMap['us']).toBeUndefined()
    })

    it('应该包含欧洲主要国家', () => {
      const europeanCountries = ['UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'CH', 'SE', 'NO']
      
      europeanCountries.forEach(country => {
        expect(regionNameMap).toHaveProperty(country)
        expect(regionNameMap[country]).toMatch(/^🇪🇺|🇬🇧|🇩🇪|🇫🇷|🇮🇹|🇪🇸|🇳🇱|🇨🇭|🇸🇪|🇳🇴/)
      })
    })

    it('应该包含亚洲主要国家', () => {
      const asianCountries = ['HK', 'JP', 'SG', 'TW', 'KR', 'IN', 'MY', 'CN']
      
      asianCountries.forEach(country => {
        expect(regionNameMap).toHaveProperty(country)
        expect(regionNameMap[country]).toMatch(/^🇭🇰|🇯🇵|🇸🇬|🇹🇼|🇰🇷|🇮🇳|🇲🇾|🇨🇳/)
      })
    })

    it('应该包含美洲主要国家', () => {
      const americanCountries = ['US', 'CA', 'BR', 'AR']
      
      americanCountries.forEach(country => {
        expect(regionNameMap).toHaveProperty(country)
        expect(regionNameMap[country]).toMatch(/^🇺🇸|🇨🇦|🇧🇷|🇦🇷/)
      })
    })

    it('应该验证特定地区的完整映射', () => {
      const specificMappings = {
        'HK': '🇭🇰 香港',
        'US': '🇺🇸 美国',
        'JP': '🇯🇵 日本',
        'SG': '🇸🇬 新加坡',
        'TW': '🇹🇼 台湾',
        'KR': '🇰🇷 韩国',
        'UK': '🇬🇧 英国',
        'DE': '🇩🇪 德国',
        'CN': '🇨🇳 中国'
      }
      
      Object.entries(specificMappings).forEach(([code, expectedName]) => {
        expect(regionNameMap[code]).toBe(expectedName)
      })
    })
  })
})