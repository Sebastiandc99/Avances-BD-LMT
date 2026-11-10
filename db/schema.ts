import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
export const events = sqliteTable('lmt_events', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), span: text('span').notNull(),
  version: integer('version').notNull(), payload: text('payload').notNull(),
  author: text('author').notNull(), receivedAt: text('received_at').notNull(),
}, t => [uniqueIndex('lmt_owner_span_version').on(t.owner, t.span, t.version), index('lmt_owner_events').on(t.owner)]);
