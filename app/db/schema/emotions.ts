import { pgTable, uuid, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { users } from './users';

// EmotionLog table
export const emotionLogs = pgTable('emotion_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  emotionScore: integer('emotion_score').notNull(), // -5 to +5
  emotionText: text('emotion_text'),
  promptUsed: text('prompt_used'),
  aiFeedback: text('ai_feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type EmotionLog = typeof emotionLogs.$inferSelect;
export type NewEmotionLog = typeof emotionLogs.$inferInsert;
