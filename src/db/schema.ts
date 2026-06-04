import { 
  pgTable, 
  uuid, 
  varchar, 
  timestamp, 
  boolean, 
  integer,
  date,
  time,
  jsonb,
  unique,
  index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  auth_provider_id: varchar('auth_provider_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  full_name: varchar('full_name', { length: 255 }),
  username: varchar('username', { length: 255 }),
  birth_year: integer('birth_year'),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  avatar_url: varchar('avatar_url', { length: 1024 }),
  theme_preference: varchar('theme_preference', { length: 50 }).default('system'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
});

// 2. User Preferences
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reminderTime: time('reminder_time').default('08:00:00'),
  isNotificationsEnabled: boolean('is_notifications_enabled').default(true),
  isMoodTrackingEnabled: boolean('is_mood_tracking_enabled').default(true),
  isEnergyTrackingEnabled: boolean('is_energy_tracking_enabled').default(true),
  isWeeklyReflectionEnabled: boolean('is_weekly_reflection_enabled').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Lifestyle Goals (Master Data)
export const lifestyleGoals = pgTable('lifestyle_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 1024 }),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
});

// 4. User Lifestyle Goals (Many-to-Many)
export const userLifestyleGoals = pgTable('user_lifestyle_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  goalId: uuid('goal_id').references(() => lifestyleGoals.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Routine Categories (Master Data)
export const routineCategories = pgTable('routine_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  icon: varchar('icon', { length: 100 }),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
});

// 6. Routines
export const routines = pgTable('routines', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => routineCategories.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }),
  timeOfDay: varchar('time_of_day', { length: 50 }), // e.g. 'morning', 'afternoon', 'night'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('routines_user_id_idx').on(table.userId),
}));

// 7. Routine Schedule Days
export const routineScheduleDays = pgTable('routine_schedule_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  routineId: uuid('routine_id').references(() => routines.id, { onDelete: 'cascade' }).notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
});

// 8. Routine Steps
export const routineSteps = pgTable('routine_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  routineId: uuid('routine_id').references(() => routines.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  durationMinutes: integer('duration_minutes').default(0),
  sortOrder: integer('sort_order').default(0),
}, (table) => ({
  routineIdIdx: index('routine_steps_routine_id_idx').on(table.routineId),
}));

// 9. Daily Flows
export const dailyFlows = pgTable('daily_flows', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  flowDate: date('flow_date').notNull(),
  completionPercentage: integer('completion_percentage').default(0),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('daily_flows_user_id_idx').on(table.userId),
  unqUserDate: unique('unq_user_flow_date').on(table.userId, table.flowDate),
}));

// 10. Daily Routine Entries
export const dailyRoutineEntries = pgTable('daily_routine_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  dailyFlowId: uuid('daily_flow_id').references(() => dailyFlows.id, { onDelete: 'cascade' }).notNull(),
  routineId: uuid('routine_id').references(() => routines.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
});

// 11. Daily Step Entries
export const dailyStepEntries = pgTable('daily_step_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  dailyRoutineEntryId: uuid('daily_routine_entry_id').references(() => dailyRoutineEntries.id, { onDelete: 'cascade' }).notNull(),
  stepId: uuid('step_id').references(() => routineSteps.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  completedAt: timestamp('completed_at'),
});

// 12. Mood Logs
export const moodLogs = pgTable('mood_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  logDate: date('log_date').notNull(),
  moodScore: integer('mood_score').notNull(), // e.g. 1-5 or 1-10
  energyLevel: integer('energy_level'),
  notes: varchar('notes', { length: 2048 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('mood_logs_user_id_idx').on(table.userId),
  unqUserDate: unique('unq_user_log_date').on(table.userId, table.logDate),
}));

// 13. Weekly Reflections
export const weeklyReflections = pgTable('weekly_reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  weekStartDate: date('week_start_date').notNull(),
  content: varchar('content', { length: 4096 }),
  rating: integer('rating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unqUserWeek: unique('unq_user_week_start_date').on(table.userId, table.weekStartDate),
}));

// 14. Reminders
export const reminders = pgTable('reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // e.g. 'routine', 'reflection'
  entityId: uuid('entity_id').notNull(),
  reminderTime: time('reminder_time').notNull(),
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('reminders_user_id_idx').on(table.userId),
}));

// 15. Plans (Master Data)
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  maxRoutines: integer('max_routines'),
  features: jsonb('features'),
});

// 16. User Subscriptions
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(() => plans.id, { onDelete: 'restrict' }).notNull(),
  status: varchar('status', { length: 50 }).default('active'),
  validUntil: timestamp('valid_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_subscriptions_user_id_idx').on(table.userId),
}));
