import { Elysia } from 'elysia';
import { env } from '../config/env';

const app = new Elysia()
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString()
  }))
  .listen(env.PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${env.PORT}`);
