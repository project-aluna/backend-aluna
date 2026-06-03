export type ErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'internal_error';

export class AppError extends Error {
  public statusCode: number;
  public code: ErrorCode;
  public details: any[];

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details: any[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
