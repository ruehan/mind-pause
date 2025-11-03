import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN', 'EXPERT']);
export const authProviderEnum = pgEnum('auth_provider', ['LOCAL', 'GOOGLE', 'KAKAO', 'NAVER']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }),
  nickname: varchar('nickname', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  role: userRoleEnum('role').default('USER').notNull(),
  authProvider: authProviderEnum('auth_provider'),
  authProviderId: varchar('auth_provider_id', { length: 255 }),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
