# Clash 配置生成器

一个基于Next.js的Clash配置文件生成工具，支持快速生成订阅链接和自定义规则。

## 功能特性

- 一键生成Clash订阅链接
- 支持自定义规则和代理组
- 可视化配置界面
- 支持多种订阅格式导出

## 技术栈

- 前端: Next.js 14, TypeScript
- 样式: Tailwind CSS
- 状态管理: Zustand
- 表单处理: React Hook Form

## 快速开始

1. 安装依赖:
```bash
npm install
```
2. 启动开发服务器:
```bash
npm run dev
```
3. 访问 [http://localhost:3000](http://localhost:3000)

## API文档

项目提供以下API端点:

- `GET /api/subscribe` - 获取订阅链接
- `POST /api/config` - 生成自定义配置
- `GET /api/rules` - 获取规则模板

## 贡献指南

欢迎提交Pull Request或Issue。开发前请先阅读:

- [Next.js文档](https://nextjs.org/docs)
- [Clash配置规范](https://github.com/Dreamacro/clash/wiki/configuration)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
