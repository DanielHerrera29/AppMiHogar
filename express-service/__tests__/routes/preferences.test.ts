import request from 'supertest';
import express from 'express';
import mainRoutes from '../../src/routes';
import pool from '../../src/config/database'; 

const app = express();
app.use(express.json());
app.use('/api/v1', mainRoutes);


import { AppError, NotFoundError, ValidationError } from '../../src/utils/appErrors';
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor.`, 404));
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  let statusCode = 500;
  let status = 'error';
  let message = 'Algo salió mal en el servidor.';
  let details = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
    if (err instanceof ValidationError && (err as any).details) {
      details = (err as any).details;
    }
  } else if (err instanceof Error) {
    console.error('ERROR (no operacional) en pruebas:', err);
  } else {
    console.error('ERROR (desconocido) en pruebas:', err);
    message = 'Un error desconocido ha ocurrido.';
  }

  res.status(statusCode).json({
    status: status,
    message: message,
    ...(details && { details: details }),
  });
});


describe('User Preferences API', () => {
  beforeAll(async () => {
    await pool.execute('TRUNCATE TABLE user_preferences');
  });

  afterEach(async () => {

    await pool.execute('TRUNCATE TABLE user_preferences');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should create new user preferences if they do not exist', async () => {
    const userId = 10;
    const newPreferences = {
      theme: 'dark',
      email_notifications: false,
      language: 'en',
    };

    const res = await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send(newPreferences)
      .expect(201); 
    expect(res.body).toHaveProperty('message', 'Preferencias creadas exitosamente');
    expect(res.body).toHaveProperty('insertId');

    const [rows]: any = await pool.execute('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    expect(rows.length).toBe(1);
    expect(rows[0].user_id).toBe(userId);
    expect(rows[0].theme).toBe(newPreferences.theme);
    expect(rows[0].email_notifications).toBe(0); 
    expect(rows[0].language).toBe(newPreferences.language);
  });

  it('should update existing user preferences', async () => {
    const userId = 20;
   
    await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send({ theme: 'light', email_notifications: true, language: 'es' })
      .expect(201);

    const updatedPreferences = {
      theme: 'system',
      dashboard_layout: 'compact',
    };

    const res = await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send(updatedPreferences)
      .expect(200); 

    expect(res.body).toHaveProperty('message', 'Preferencias guardadas exitosamente');

    const [rows]: any = await pool.execute('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    expect(rows.length).toBe(1);
    expect(rows[0].theme).toBe(updatedPreferences.theme);
    expect(rows[0].dashboard_layout).toBe(updatedPreferences.dashboard_layout);
    expect(rows[0].email_notifications).toBe(1); 
    expect(rows[0].language).toBe('es');
  });

  it('should get user preferences', async () => {
    const userId = 30;
    await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send({ theme: 'dark', email_notifications: false, language: 'fr' })
      .expect(201);

    const res = await request(app)
      .get(`/api/v1/preferences/${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('user_id', userId);
    expect(res.body).toHaveProperty('theme', 'dark');
    expect(res.body).toHaveProperty('email_notifications', 0);
    expect(res.body).toHaveProperty('language', 'fr');
  });

  it('should return 404 if user preferences are not found', async () => {
    const nonExistentUserId = 9999;
    const res = await request(app)
      .get(`/api/v1/preferences/${nonExistentUserId}`)
      .expect(404); 

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Preferencias de usuario no encontradas');
  });

  it('should return 400 for invalid language format in preferences update', async () => {
    const userId = 40;
 
    await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send({ theme: 'light', email_notifications: true, language: 'es' })
      .expect(201);

    const invalidUpdate = {
      language: 'eng',
    };

    const res = await request(app)
      .put(`/api/v1/preferences/${userId}`)
      .send(invalidUpdate)
      .expect(400);

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Error de validación de entrada');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'language',
          message: '"language" length must be 2 characters long',
        }),
      ])
    );
  });
});