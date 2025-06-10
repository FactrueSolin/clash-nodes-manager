import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const proxy = sqliteTable('proxy', {
  id: text('id').primaryKey().default(sql`(uuid())`),
  name: text('name').notNull().unique(),
  area: text('area').notNull(),
  ip: text('ip').notNull().unique(),
  type: text('type').notNull(),
  port: integer('port').notNull(),
  method: text('method').default('auto').notNull(),
  password: text('password').notNull(),
  status: integer({ mode: 'boolean' }).default(true).notNull(),
  createdAt: text('createdAt').default(sql`(current_timestamp)`).notNull(),
  updatedAt: text('updatedAt').default(sql`(current_timestamp)`).notNull()
});

export const proxyUrl = sqliteTable('proxyUrl', {
  uuid: text('uuid').primaryKey().default(sql`(uuid())`),
  name: text('name').notNull(),
  url: text('url').notNull(),
  status: integer({ mode: 'boolean' }).default(true).notNull(),
  createdAt: text('createdAt').default(sql`(current_timestamp)`).notNull(),
  updatedAt: text('updatedAt').default(sql`(current_timestamp)`).notNull()
});