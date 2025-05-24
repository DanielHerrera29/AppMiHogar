
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/appErrors';


type ValidationSource = 'body' | 'query' | 'params';

/**
 * 
 * @param schema 
 * @param source 
 */
export const validateRequest = (schema: Joi.ObjectSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    let dataToValidate: any;

    switch (source) {
      case 'body':
        dataToValidate = req.body;
        break;
      case 'query':
        dataToValidate = req.query;
        break;
      case 'params':
        dataToValidate = req.params;
        break;
      default:
       
        return next(new Error('Fuente de validación no soportada.'));
    }

 
    if (source === 'body' && req.params && Object.keys(req.params).length > 0) {
      dataToValidate = { ...req.params, ...req.body };
    }

    const { error } = schema.validate(dataToValidate, { abortEarly: false, allowUnknown: true });
    
    if (error) {
  
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'), 
        message: detail.message,      
      }));
      return next(new ValidationError('Error de validación de entrada', errorDetails));
    }
    next();
  };
};