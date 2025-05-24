
import { Request, Response, NextFunction } from 'express'; 
import ActivityLogModel from '../models/activityLogModel';
import { AppError } from '../utils/appErrors'; 

class ActivityLogController {
  static async recordLog(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { user_id, event_type, event_details } = req.body;
    const ip_address = req.ip || 'unknown'; 

    try {
      const logId = await ActivityLogModel.create({
        user_id,
        event_type,
        event_details: event_details || {},
        ip_address: ip_address,
      });
      return res.status(201).json({ message: 'Log registrado exitosamente', logId });
    } catch (error) {
      console.error('Error al registrar log:', error);
      next(new AppError('Error interno del servidor al registrar log.', 500)); 
    }
  }

  static async getLogsByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params; 
    try {
      const logs = await ActivityLogModel.findByUserId(parseInt(userId, 10));
      return res.json(logs);
    } catch (error) {
      console.error('Error al obtener logs por usuario:', error);
      next(new AppError('Error interno del servidor al obtener logs.', 500));
    }
  }

  static async getLogsByEventType(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { eventType } = req.params; 
    try {
      const logs = await ActivityLogModel.findByEventType(eventType);
      return res.json(logs);
    } catch (error) {
      console.error('Error al obtener logs por tipo de evento:', error);
      next(new AppError('Error interno del servidor al obtener logs por tipo.', 500));
    }
  }
}

export default ActivityLogController;
