
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean; 

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

   
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Datos de entrada inválidos', details?: any) {
    super(message, 400);
    this.name = 'ValidationError';
    if (details) {
     
      (this as any).details = details;
    }
  }
}


export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404); 
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto de recursos') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}


export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}