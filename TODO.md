# todo.md — Aluna Backend

Version: 1.0  
Stack: Bun + ElysiaJS + Zod + Drizzle ORM + MySQL  
Status: Backend Execution Plan

---

# 1. Backend Goal

Backend Aluna harus mendukung core MVP:

- auth sync
- user profile
- onboarding
- routine CRUD
- routine steps
- daily flow generation
- daily step completion
- mood logging
- weekly reflection
- reminders
- subscription foundation

Fokus awal:

> backend stabil, aman basic, clean structure, dan siap dipakai Flutter frontend.

---

# 2. Backend Principles

- REST API first
- validation wajib di setiap request body/query/params
- semua protected route wajib auth
- semua user-owned data wajib ownership check
- response format konsisten
- error format konsisten
- jangan over-engineer sebelum MVP jalan
- no AI, no queue, no Redis dulu

---

# 3. Phase 0 — Repo Setup

## 3.1 Initialize Project

- [x] Create backend repo
- [x] Init Bun project
- [x] Setup TypeScript
- [x] Setup ElysiaJS
- [x] Setup project scripts
- [x] Setup `.env.example`
- [x] Setup `.gitignore`
- [x] Setup README basic

---

## 3.2 Install Core Dependencies

- [x] elysia
- [x] @elysiajs/cors
- [x] @elysiajs/bearer
- [x] @elysiajs/swagger
- [x] zod
- [x] drizzle-orm
- [x] drizzle-kit
- [x] mysql2
- [x] winston
- [x] dotenv
- [x] nanoid
- [x] dayjs

---

## 3.3 Install Dev Dependencies

- [x] typescript
- [x] eslint
- [x] prettier
- [x] @types/node

---

# 4. Phase 1 — Folder Structure

## 4.1 Create Base Structure

```txt
src/
  app/
    server.ts
    routes.ts

  config/
    env.ts
    cors.ts

  db/
    connection.ts
    schema/
    migrations/
    seeds/

  modules/
    auth/
    users/
    preferences/
    lifestyle-goals/
    routine-categories/
    routines/
    routine-steps/
    daily-flows/
    mood-logs/
    weekly-reflections/
    reminders/
    plans/
    subscriptions/

  middlewares/
    auth.middleware.ts
    error.middleware.ts
    logger.middleware.ts
    rate-limit.middleware.ts

  shared/
    constants/
    errors/
    helpers/
    types/
    validators/

  services/
    logger.service.ts
    date.service.ts
    entitlement.service.ts

  utils/
    response.ts
    pagination.ts
    ownership.ts
````

---

# 5. Phase 2 — Environment Config

## 5.1 Required Environment Variables

* [ ] NODE_ENV
* [ ] PORT
* [ ] DATABASE_URL
* [ ] CORS_ORIGIN
* [ ] AUTH_PROVIDER
* [ ] SUPABASE_JWT_SECRET
* [ ] API_VERSION
* [ ] LOG_LEVEL

---

## 5.2 Env Validation

* [ ] Create env schema with Zod
* [ ] Validate env on app startup
* [ ] Stop app if required env missing
* [ ] Never access `process.env` directly outside config layer

---

# 6. Phase 3 — App Bootstrap

## 6.1 Elysia Server

* [ ] Create base Elysia app
* [ ] Add global prefix `/api/v1`
* [ ] Add health check route
* [ ] Add CORS plugin
* [ ] Add Swagger plugin for dev
* [ ] Add global error handler
* [ ] Add request logger
* [ ] Start server from `server.ts`

---

## 6.2 Health Check

Endpoint:

```txt
GET /health
```

Return:

* app status
* environment
* timestamp
* version

---

# 7. Phase 4 — Response & Error Standard

## 7.1 Success Response Format

* [ ] Create helper for success response
* [ ] Use same format across all endpoints

Format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

---

## 7.2 Error Response Format

* [ ] Create AppError class
* [ ] Create error codes
* [ ] Create global error handler
* [ ] Hide internal error details in production
* [ ] Log detailed error server-side

Format:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "validation_error",
    "details": []
  }
}
```

---

## 7.3 Error Codes

* [ ] validation_error
* [ ] unauthorized
* [ ] forbidden
* [ ] not_found
* [ ] conflict
* [ ] rate_limited
* [ ] internal_error

---

# 8. Phase 5 — Logger

## 8.1 Winston Setup

* [ ] Create Winston logger service
* [ ] Add console transport
* [ ] Add log level from env
* [ ] Use JSON logs in production
* [ ] Use readable logs in development

---

## 8.2 Request Logging

* [ ] Log method
* [ ] Log path
* [ ] Log status code
* [ ] Log response time
* [ ] Log request id
* [ ] Do not log sensitive fields

Sensitive fields:

* password
* token
* authorization
* refresh_token
* access_token

---

# 9. Phase 6 — Basic Security

## 9.1 CORS

* [ ] Allow only configured origins
* [ ] Reject unknown origins in production
* [ ] Allow localhost in development

---

## 9.2 Headers

* [ ] Add basic security headers
* [ ] Disable unnecessary powered-by headers
* [ ] Set JSON content-type consistently

---

## 9.3 Rate Limiting

* [ ] Add simple in-memory rate limiter for MVP
* [ ] Limit auth-sensitive endpoints stricter
* [ ] Return `rate_limited` error code

Suggested limits:

* global: 100 requests / 15 minutes
* auth sync: 20 requests / 15 minutes
* write operations: 60 requests / 15 minutes

---

## 9.4 Input Protection

* [ ] Validate body with Zod
* [ ] Validate query with Zod
* [ ] Validate params with Zod
* [ ] Trim user input
* [ ] Limit string length
* [ ] Reject unknown fields where needed

---

# 10. Phase 7 — Database Setup

## 10.1 Drizzle Setup

* [ ] Configure Drizzle
* [ ] Configure MySQL connection
* [ ] Configure drizzle-kit
* [ ] Create migration folder
* [ ] Create database connection test

---

## 10.2 Schema Creation Priority

Create tables in this order:

* [ ] users
* [ ] user_preferences
* [ ] lifestyle_goals
* [ ] user_lifestyle_goals
* [ ] routine_categories
* [ ] routines
* [ ] routine_schedule_days
* [ ] routine_steps
* [ ] daily_flows
* [ ] daily_routine_entries
* [ ] daily_step_entries
* [ ] mood_logs
* [ ] weekly_reflections
* [ ] reminders
* [ ] plans
* [ ] user_subscriptions

---

## 10.3 Indexes & Constraints

* [ ] unique users.email
* [ ] unique users.auth_provider_id
* [ ] unique daily_flows.user_id + flow_date
* [ ] unique mood_logs.user_id + log_date
* [ ] unique weekly_reflections.user_id + week_start_date
* [ ] index routines.user_id
* [ ] index routine_steps.routine_id
* [ ] index daily_flows.user_id
* [ ] index mood_logs.user_id
* [ ] index reminders.user_id
* [ ] index user_subscriptions.user_id

---

# 11. Phase 8 — Seed Data

## 11.1 Lifestyle Goals Seed

* [ ] Tidur lebih teratur
* [ ] Skincare lebih konsisten
* [ ] Pagi lebih tenang
* [ ] Kurangi overwhelmed
* [ ] Lebih rutin bergerak
* [ ] Punya waktu untuk diri sendiri

---

## 11.2 Routine Categories Seed

* [ ] Morning
* [ ] Night
* [ ] Skincare
* [ ] Wellness
* [ ] Fitness
* [ ] Haircare
* [ ] Mindfulness
* [ ] Cycle Care

---

## 11.3 Plans Seed

* [ ] Free
* [ ] Premium Monthly
* [ ] Premium Yearly

Free plan:

* max 3 routines
* basic reflection
* standard themes

Premium plan:

* unlimited routines
* advanced reflection
* premium themes
* widgets

---

# 12. Phase 9 — Auth Module

## 12.1 Auth Strategy

MVP auth source:

* Supabase Auth

Backend role:

* verify token
* sync auth identity
* map auth user to internal user table

---

## 12.2 Auth Middleware

* [ ] Read Bearer token
* [ ] Verify token
* [ ] Extract auth provider id
* [ ] Attach current user to request context
* [ ] Reject invalid token
* [ ] Reject missing token on protected routes

---

## 12.3 Auth Sync Endpoint

```txt
POST /auth/sync
```

Tasks:

* [ ] Validate request body
* [ ] Find user by auth_provider_id
* [ ] Create user if not exists
* [ ] Create default user_preferences
* [ ] Create default free subscription
* [ ] Update profile fields if needed
* [ ] Return current user

---

# 13. Phase 10 — Users Module

## 13.1 Endpoints

```txt
GET /me
PATCH /me
```

Tasks:

* [ ] Get current user
* [ ] Update profile
* [ ] Validate timezone
* [ ] Validate birth_year
* [ ] Prevent email update from this endpoint
* [ ] Hide deleted user data

---

# 14. Phase 11 — Preferences Module

## 14.1 Endpoints

```txt
GET /preferences
PATCH /preferences
```

Tasks:

* [ ] Get current user preferences
* [ ] Update reminder time
* [ ] Update notification toggle
* [ ] Update mood tracking toggle
* [ ] Update energy tracking toggle
* [ ] Update weekly reflection toggle

---

# 15. Phase 12 — Master Data Modules

## 15.1 Lifestyle Goals

```txt
GET /lifestyle-goals
```

Tasks:

* [ ] Return active lifestyle goals
* [ ] Sort by sort_order

---

## 15.2 Routine Categories

```txt
GET /routine-categories
```

Tasks:

* [ ] Return active categories
* [ ] Sort by sort_order

---

## 15.3 Plans

```txt
GET /plans
```

Tasks:

* [ ] Return active plans
* [ ] Hide internal provider fields
* [ ] Return entitlement summary

---

# 16. Phase 13 — Subscription Foundation

## 16.1 Endpoints

```txt
GET /subscription/current
POST /subscription/sync
```

Tasks:

* [ ] Return current subscription
* [ ] Return user entitlements
* [ ] Create entitlement service
* [ ] Check free routine limit
* [ ] Stub RevenueCat sync for later
* [ ] Do not trust premium status from client only

---

# 17. Phase 14 — Onboarding Module

## 17.1 Endpoint

```txt
POST /onboarding/complete
```

Tasks:

* [ ] Validate selected lifestyle goals
* [ ] Save user_lifestyle_goals
* [ ] Save reminder preference
* [ ] Create starter routine
* [ ] Create starter routine steps
* [ ] Generate first daily flow
* [ ] Mark onboarding_completed true
* [ ] Return user + routine + daily flow

---

# 18. Phase 15 — Routines Module

## 18.1 Endpoints

```txt
GET /routines
GET /routines/:routine_id
POST /routines
PATCH /routines/:routine_id
DELETE /routines/:routine_id
```

Tasks:

* [ ] List user routines
* [ ] Get routine detail with steps and schedule days
* [ ] Create routine
* [ ] Update routine
* [ ] Soft delete routine
* [ ] Validate ownership
* [ ] Validate free plan routine limit
* [ ] Handle schedule_type
* [ ] Handle schedule_days
* [ ] Recalculate estimated duration if needed

---

# 19. Phase 16 — Routine Steps Module

## 19.1 Endpoints

```txt
POST /routines/:routine_id/steps
PATCH /routine-steps/:step_id
DELETE /routine-steps/:step_id
PATCH /routines/:routine_id/steps/reorder
```

Tasks:

* [ ] Add step to routine
* [ ] Update step
* [ ] Soft delete step
* [ ] Reorder steps
* [ ] Validate routine ownership
* [ ] Validate step ownership through routine
* [ ] Prevent duplicate sort_order issues

---

# 20. Phase 17 — Daily Flow Module

## 20.1 Endpoints

```txt
GET /daily-flow/today
GET /daily-flow?date=YYYY-MM-DD
POST /daily-flow/regenerate
```

Tasks:

* [ ] Get or generate daily flow
* [ ] Generate daily flow from active routines
* [ ] Respect user timezone
* [ ] Respect schedule_type
* [ ] Respect schedule_days
* [ ] Create daily_routine_entries
* [ ] Create daily_step_entries
* [ ] Return full timeline payload
* [ ] Preserve historical snapshots

---

## 20.2 Daily Flow Generation Rules

* [ ] Use routine as template
* [ ] Use daily_flow as snapshot
* [ ] Do not mutate old daily flows when routine changes
* [ ] Skip deleted routines
* [ ] Skip deleted steps
* [ ] Sort routines by start_time and sort_order
* [ ] Sort steps by sort_order

---

# 21. Phase 18 — Daily Completion Module

## 21.1 Endpoints

```txt
PATCH /daily-step-entries/:entry_id/status
PATCH /daily-routine-entries/:entry_id/status
```

Tasks:

* [ ] Complete step
* [ ] Skip step
* [ ] Mark routine completed
* [ ] Auto-complete routine if all required steps completed
* [ ] Recalculate daily flow progress
* [ ] Return updated daily flow summary
* [ ] Validate ownership through daily flow

---

# 22. Phase 19 — Mood Logs Module

## 22.1 Endpoints

```txt
GET /mood-logs
PUT /mood-logs
DELETE /mood-logs/:mood_log_id
```

Tasks:

* [ ] List mood logs by date range
* [ ] Create or update mood log by date
* [ ] Delete mood log
* [ ] Enforce one mood log per date
* [ ] Validate mood_score 1–5
* [ ] Validate energy_score 1–5
* [ ] Validate stress_score 1–5
* [ ] Validate ownership

---

# 23. Phase 20 — Weekly Reflections Module

## 23.1 Endpoints

```txt
GET /weekly-reflections
GET /weekly-reflections/latest
POST /weekly-reflections/generate
```

Tasks:

* [ ] Generate weekly reflection from daily flows and mood logs
* [ ] Calculate completed routines
* [ ] Calculate total routines
* [ ] Calculate completion percentage
* [ ] Calculate average mood score
* [ ] Calculate average energy score
* [ ] Calculate average stress score
* [ ] Generate rule-based summary text
* [ ] Generate rule-based insight text
* [ ] Prevent duplicate weekly reflection
* [ ] Return latest reflection

---

# 24. Phase 21 — Reminders Module

## 24.1 Endpoints

```txt
GET /reminders
POST /reminders
PATCH /reminders/:reminder_id
DELETE /reminders/:reminder_id
```

Tasks:

* [ ] List reminders
* [ ] Create reminder
* [ ] Update reminder
* [ ] Delete reminder
* [ ] Validate routine_id belongs to user
* [ ] Validate reminder_time HH:mm
* [ ] Support local notification sync from Flutter

---

# 25. Phase 22 — API Documentation

## 25.1 Swagger

* [ ] Enable Swagger only in development/staging
* [ ] Document auth requirement
* [ ] Document request body schema
* [ ] Document response format
* [ ] Document error format

---

# 26. Phase 23 — Testing

## 26.1 Manual API Testing

* [ ] Health check
* [ ] Auth sync
* [ ] Get current user
* [ ] Complete onboarding
* [ ] Create routine
* [ ] Add routine steps
* [ ] Generate daily flow
* [ ] Complete step
* [ ] Log mood
* [ ] Generate weekly reflection
* [ ] Create reminder
* [ ] Validate free plan routine limit
* [ ] Validate ownership protection

---

## 26.2 Critical Test Cases

* [ ] User cannot access another user's routine
* [ ] User cannot update another user's step
* [ ] User cannot complete another user's daily entry
* [ ] User cannot exceed free routine limit
* [ ] Daily flow does not duplicate for same date
* [ ] Mood log does not duplicate for same date
* [ ] Deleted routine does not appear in new daily flow
* [ ] Old daily flow remains unchanged after routine edit

---

# 27. Phase 24 — Deployment Prep

## 27.1 Production Readiness

* [ ] Setup production environment variables
* [ ] Setup production MySQL
* [ ] Run migrations
* [ ] Run seed data
* [ ] Configure CORS production origin
* [ ] Disable Swagger in production
* [ ] Enable production logger format
* [ ] Test health endpoint
* [ ] Test database connection
* [ ] Test auth verification

---

# 28. Build Order Recommendation

Build backend in this order:

1. Project setup
2. Env config
3. Logger
4. Error handler
5. Database connection
6. Schema + migrations
7. Seed data
8. Auth middleware
9. Auth sync
10. User + preferences
11. Master data
12. Subscription foundation
13. Onboarding
14. Routines
15. Routine steps
16. Daily flow
17. Daily completion
18. Mood logs
19. Weekly reflections
20. Reminders
21. Swagger cleanup
22. Deployment prep

---

# 29. MVP Backend Done Criteria

Backend MVP selesai jika:

* [ ] app bisa start tanpa error
* [ ] env tervalidasi
* [ ] database connected
* [ ] migrations jalan
* [ ] seed data tersedia
* [ ] auth middleware jalan
* [ ] user sync berhasil
* [ ] onboarding berhasil create starter routine
* [ ] routine CRUD berjalan
* [ ] routine steps berjalan
* [ ] daily flow bisa auto-generate
* [ ] step completion update progress
* [ ] mood log berjalan
* [ ] weekly reflection basic bisa generate
* [ ] reminder CRUD berjalan
* [ ] free plan routine limit aktif
* [ ] ownership protection aktif
* [ ] error response konsisten
* [ ] logger tidak leak sensitive data
* [ ] basic security aktif

---

# 30. Hard Rule

Jangan kerjakan dulu:

* AI reflection
* RevenueCat real integration
* Redis queue
* server-side push notification
* social features
* themes advanced
* file upload
* admin dashboard

Selesaikan backend core loop dulu.

Backend yang bagus untuk MVP bukan yang paling canggih.

Backend yang bagus adalah yang:

* aman basic
* predictable
* gampang di-debug
* bisa dipakai frontend tanpa drama
* tidak bikin solo developer tenggelam di complexity

```