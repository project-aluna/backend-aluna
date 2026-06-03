import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { env } from '../config/env';
import { errorMiddleware } from '../middlewares/error.middleware';
import { loggerMiddleware } from '../middlewares/logger.middleware';
import { successResponse } from '../utils/response';
import { logger } from '../services/logger.service';

const app = new Elysia();

app.use(cors({ origin: env.CORS_ORIGIN }));

if (env.NODE_ENV !== 'production') {
  app.use(swagger());
}

app.use(errorMiddleware);
app.use(loggerMiddleware);

app.get('/health', () => {
  return successResponse({
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: env.API_VERSION
  }, "App is healthy");
});

app.group('/api/v1', (v1) => v1);

app.listen(env.PORT);

logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${env.PORT}`);
