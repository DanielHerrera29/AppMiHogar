import { Request, Response, NextFunction } from 'express';
import PreferenceModel from '../models/preferenceModel';
import { NotFoundError, AppError } from '../utils/appErrors';

class PreferenceController {
  static async getUserPreferences(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params;
    try {
      const preferences = await PreferenceModel.findByUserId(parseInt(userId, 10));
      if (!preferences) {
        return next(new NotFoundError('Preferencias de usuario no encontradas'));
      }
      return res.json(preferences);
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      next(new AppError('Error interno del servidor al obtener preferencias.', 500));
    }
  }

  static async createOrUpdatePreferences(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params;
    const { theme, email_notifications, dashboard_layout, language } = req.body;

    try {
      const result = await PreferenceModel.createOrUpdate(parseInt(userId, 10), {
        theme,
        email_notifications,
        dashboard_layout,
        language,
      });

      if (result.affectedRows > 0) {
        return res.json({ message: 'Preferencias guardadas exitosamente', rowsAffected: result.affectedRows });
      } else if (result.insertId) {
        return res.status(201).json({ message: 'Preferencias creadas exitosamente', insertId: result.insertId });
      } else {
        return res.status(200).json({ message: 'Preferencias procesadas (posiblemente sin cambios).' });
      }
    } catch (error) {
      console.error('Error al guardar/actualizar preferencias:', error);
      next(new AppError('Error interno del servidor al guardar preferencias.', 500));
    }
  }
}

export default PreferenceController;
