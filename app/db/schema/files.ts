import { pgTable, uuid, varchar, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

// Enums
export const entityTypeEnum = pgEnum('entity_type', ['POST', 'COMMENT', 'USER_PROFILE']);

// FileAttachment table
export const fileAttachments = pgTable('file_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(), // 연결된 엔터티 ID
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: varchar('file_url', { length: 1000 }).notNull(),
  fileSize: integer('file_size').notNull(), // bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type NewFileAttachment = typeof fileAttachments.$inferInsert;
