import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core'

// Auth.js v5 tables (subset; @auth/neon-adapter compatible)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
})

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  demo: boolean('demo').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  progress: integer('progress').notNull().default(0),
  enrolledAt: timestamp('enrolled_at', { mode: 'date' }).defaultNow(),
})

export const credentialsIssued = pgTable('credentials_issued', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  // OpenBadges 3.0 AchievementCredential VC 2.0 (signed JWT / JSON-LD stored)
  credentialJwt: text('credential_jwt').notNull(),
  // credentialStatus index URL
  statusId: text('status_id').notNull().unique(),
  revoked: boolean('revoked').notNull().default(false),
  issuedAt: timestamp('issued_at', { mode: 'date' }).defaultNow(),
})
