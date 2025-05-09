import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { createProxySchema,updateProxySchema,deleteProxySchema,getProxySchema } from './types'
import { appenv } from '@/appenv'
import { db } from '@/app/server/db'
import { generateFullConfig } from '@/app/server/config'
import {
	setCookie,
  getCookie,
  } from 'hono/cookie'
import yaml from 'js-yaml'
const app = new Hono<{Variables:HonoEnv}>().basePath('/api')
type HonoEnv = {
  
    key: string
  
}

app.use('*',async (c,next)=>{

  
  let jsonKey:string|null=null
  if(c.req.method!='GET'){
    const body=await c.req.json()
    jsonKey=body.key
  }
 
  const cookieKey=getCookie(c,'key')
  const queryKey=c.req.query('key')
  const key=queryKey||cookieKey||jsonKey
  if(key!=appenv.key){
    return c.json({
      code: 0,
      message: '认证权杖错误',
    }, 400)
  }
  c.set('key',key)
  await next()

})

app.post('/login', async (c) => {
  const key=c.get('key')
 
  setCookie(c, 'key', key, {
    httpOnly: true,
    //secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return c.json({
    code: 1,
    message: '认证成功',
  })




})
//创建节点
app.post('/proxys',async (c) => {
  const data = await c.req.json()
  const proxy = createProxySchema.safeParse(data)
  if (!proxy.success) {
    return c.json({ 
      code: 0,
      message: proxy.error.format(),
    }, 400)
  }
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

  const res = await db.getProxys(proxy.data)
  return c.json({
    code: 1,
    message: `节点获取成功`,
    data: res
  })
})

app.get('/config', async (c) => {
  const res = await db.getProxys({})
  const config = generateFullConfig(res)
  const yamlData = yaml.dump(config)
  return new Response(yamlData, {
    headers: {
      'Content-Type': 'text/yaml',
      'Content-Disposition': 'attachment; filename="clash-config.yaml"'
    }
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)