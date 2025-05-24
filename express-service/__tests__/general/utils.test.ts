import { AppError, ValidationError, NotFoundError, ConflictError, UnauthorizedError } from '../../src/utils/appErrors';

describe('AppError Utility', () => {
  it('should create an AppError with correct properties', () => {
    const message = 'Something went wrong';
    const statusCode = 400;
    const error = new AppError(message, statusCode);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail'); 
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('should set status to "error" for 5xx status codes', () => {
    const error = new AppError('Internal Server Error', 500);
    expect(error.status).toBe('error');
  });

  it('should create a ValidationError with correct properties and details', () => {
    const message = 'Invalid input data';
    const details = [{ field: 'email', message: '"email" must be a valid email' }];
    const error = new ValidationError(message, details);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('ValidationError');
    expect((error as any).details).toEqual(details); 
  });

  it('should create a NotFoundError with correct properties', () => {
    const error = new NotFoundError('Resource not found');

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });

  it('should create a ConflictError with correct properties', () => {
    const error = new ConflictError('Resource already exists');

    expect(error).toBeInstanceOf(ConflictError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(409);
    expect(error.name).toBe('ConflictError');
  });

  it('should create an UnauthorizedError with correct properties', () => {
    const error = new UnauthorizedError('Access denied');

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('UnauthorizedError');
  });
});