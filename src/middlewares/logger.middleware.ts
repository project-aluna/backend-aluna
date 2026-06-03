import { Elysia } from 'elysia';
import { logger } from '../services/logger.service';
import { nanoid } from 'nanoid';

const sensitiveFields = ['password', 'token', 'authorization', 'refresh_token', 'access_token'];

function filterSensitive(data: any): any {
  if (!data || typeof data !== 'object') return data;
  const filtered = { ...data };
  for (const key of Object.keys(filtered)) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      filtered[key] = '[REDACTED]';
    } else if (typeof filtered[key] === 'object') {
      filtered[key] = filterSensitive(filtered[key]);
    }
  }
  return filtered;
}

export const loggerMiddleware = new Elysia({ name: 'logger-middleware' })
  .state('requestStartTime', performance.now())
  .onRequest(({ store }) => {
    store.requestStartTime = performance.now();
  })
  .onAfterHandle(({ request, store, set }) => {
    const responseTimeMs = performance.now() - store.requestStartTime;
    const reqId = nanoid();

    logger.info(`[${reqId}] ${request.method} ${new URL(request.url).pathname} ${set.status || 200} - ${responseTimeMs.toFixed(2)}ms`);
  });
