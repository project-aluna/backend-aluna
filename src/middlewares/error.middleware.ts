import { Elysia } from 'elysia';
import { AppError } from '../shared/errors/AppError';
import { env } from '../config/env';

export const errorMiddleware = new Elysia({ name: 'error-middleware' })
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Validation failed',
        error: {
          code: 'validation_error',
          // 'error.all' is provided by Elysia's ValidationError
          details: (error as any).all || []
        }
      };
    }

    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        message: error.message,
        error: {
          code: error.code,
          details: error.details
        }
      };
    }

    set.status = 500;
    
    // Log the actual error internally (to be replaced by Winston in Phase 5 setup if preferred)
    console.error('Unhandled Exception:', error);

    return {
      success: false,
      message: env.NODE_ENV === 'production' ? 'Internal server error' : (error as any).message || 'Unknown error',
      error: {
        code: 'internal_error',
        details: []
      }
    };
  });
