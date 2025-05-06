import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { createProxySchema,updateProxySchema,deleteProxySchema,getProxySchema } from './types'
import { appenv } from '@/appenv'
import { db } from '@/app/server/db'
import { generateFullConfig } from '@/app/server/config'
const app = new Hono().basePath('/api')


app.post('/proxys',async (c) => {
  const data = await c.req.json()
  const proxy = createProxySchema.safeParse(data)
  if (!proxy.success) {
    return c.json({ 
      code: 0,
      message: proxy.error.format(),
    }, 400)
  }
  if(proxy.data.key!=appenv.key){
    return c.json({
      code: 0,
      message: '认证权杖错误',
    })}
    const res=await db.createProxy(proxy.data)
    return c.json({
      code: 1,
      message: `节点${res.name}添加成功`,
      data:res
    })

    
  }

)

app.put('/proxys', async (c) => {
  const data = await c.req.json()
  const proxy = updateProxySchema.safeParse(data)
  if (!proxy.success) {
    return c.json({ 
      code: 0,
      message: proxy.error.format(),
    }, 400)
  }
  if(proxy.data.key != appenv.key) {
    return c.json({
      code: 0,
      message: '认证权杖错误',
    })
  }
  const res = await db.updateProxy(proxy.data)
  if (!res) {
    return c.json({
      code: 0,
      message: `uuid:${proxy.data.uuid}节点不存在`,
    }, 400)
  }
  return c.json({
    code: 1,
    message: `节点${res.name}更新成功`,
    data: res
  })
})

app.delete('/proxys', async (c) => {
  const data = await c.req.json()
  const proxy = deleteProxySchema.safeParse(data)
  if (!proxy.success) {
    return c.json({
      code: 0,
      message: proxy.error.format(),
    }, 400)
  }
  if(proxy.data.key!= appenv.key) {
    return c.json({
      code: 0,
      message: '认证权杖错误',
    })
  }
  const res = await db.deleteProxy(proxy.data)
  if (!res) {
    return c.json({
      code: 0,
      message: `uuid:${proxy.data.uuid}节点不存在`,
    })
  }
  return c.json({
    code: 1,
    message: `节点${res.name}删除成功`,
  })
  
})

app.get('/proxys', async (c) => {
  const proxy = getProxySchema.safeParse(c.req.query())
  if (!proxy.success) {
    return c.json({
      code: 0,
      message: proxy.error.format(),
    }, 400)
  }
  if(proxy.data.key!= appenv.key) {
    return c.json({
      code: 0,
      message: '认证权杖错误',
    })
  }
  const res = await db.getProxys(proxy.data)
  return c.json({
    code: 1,
    message: `节点获取成功`,
    data: res
  })
})

app.get('/config', async (c) => {
  const key = c.req.query('key')
  if(key!= appenv.key) {
    return c.json({
      code: 0,
      message: '认证权杖错误',
    })
  }
  const res = await db.getProxys({key})
  const config = generateFullConfig(res)
  const yaml = require('js-yaml').dump(config)
  return new Response(yaml, {
    headers: {
      'Content-Type': 'text/yaml'
    }
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)