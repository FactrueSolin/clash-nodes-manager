import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { createProxySchema } from './types'
import { appenv } from '@/appenv'
import { db } from '@/app/server/db'
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

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)