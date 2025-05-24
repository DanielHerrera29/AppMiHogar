
import Joi from 'joi';

export const createActivityLogSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  event_type: Joi.string().trim().min(3).max(255).required(),
  event_details: Joi.object().optional(),
});

export const getActivityLogsByUserIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
});

export const getActivityLogsByEventTypeSchema = Joi.object({
  eventType: Joi.string().trim().min(3).max(255).required(),
});

export const userIdParamSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
});


export const createOrUpdateUserPreferencesBodySchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system').optional(),
  email_notifications: Joi.boolean().optional(),
  dashboard_layout: Joi.string().max(255).allow(null).optional(),
  language: Joi.string().length(2).optional(),
}).min(1); 

export const getUserPreferencesSchema = Joi.object({
  
});


export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().max(1000).allow(null).optional(),
  price: Joi.number().precision(2).positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  low_stock_threshold: Joi.number().integer().min(0).required(),
});

export const getProductByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const updateProductSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(3).max(255).optional(),
  description: Joi.string().max(1000).allow(null).optional(),
  price: Joi.number().precision(2).positive().optional(),
  quantity: Joi.number().integer().min(0).optional(),
  low_stock_threshold: Joi.number().integer().min(0).optional(),
}).min(1);

export const consumeProductSchema = Joi.object({
 
  quantity: Joi.number().integer().positive().required(),
});

export const addProductStockSchema = Joi.object({

  quantity: Joi.number().integer().positive().required(),
});