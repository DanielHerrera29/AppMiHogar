import request from 'supertest';
import express from 'express';
import mainRoutes from '../../src/routes'; 
import pool from '../../src/config/database'; 


const app = express();
app.use(express.json()); 
app.use('/api/v1', mainRoutes);


import { AppError, ValidationError } from '../../src/utils/appErrors';
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


describe('Activity Logs API', () => {
  beforeAll(async () => {

    await pool.execute('TRUNCATE TABLE activity_logs');
  });

  afterAll(async () => {
  
    await pool.end();
  });

  it('should record a new activity log successfully', async () => {
    const newLog = {
      user_id: 1,
      event_type: 'USER_LOGIN',
      event_details: { browser: 'Chrome', os: 'Windows' },
    };

    const res = await request(app)
      .post('/api/v1/logs/record')
      .send(newLog)
      .expect(201); 

    expect(res.body).toHaveProperty('message', 'Log registrado exitosamente');
    expect(res.body).toHaveProperty('logId');
    expect(typeof res.body.logId).toBe('number');

   
    const [rows]: any = await pool.execute('SELECT * FROM activity_logs WHERE id = ?', [res.body.logId]);
    expect(rows.length).toBe(1);
    expect(rows[0].user_id).toBe(newLog.user_id);
    expect(rows[0].event_type).toBe(newLog.event_type);
  });

  it('should return 400 if required fields are missing when recording a log', async () => {
    const invalidLog = {
      user_id: 1,
    };

    const res = await request(app)
      .post('/api/v1/logs/record')
      .send(invalidLog)
      .expect(400); 

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Error de validación de entrada');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'event_type',
          message: '"event_type" is required',
        }),
      ])
    );
  });

  it('should get activity logs by user ID', async () => {
   
    await request(app).post('/api/v1/logs/record').send({ user_id: 1, event_type: 'VIEW_PROFILE', event_details: {} });
    await request(app).post('/api/v1/logs/record').send({ user_id: 1, event_type: 'UPDATE_PROFILE', event_details: {} });
    await request(app).post('/api/v1/logs/record').send({ user_id: 2, event_type: 'LOGIN', event_details: {} }); // Otro usuario

    const res = await request(app)
      .get('/api/v1/logs/user/1')
      .expect(200); 

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.every((log: any) => log.user_id === 1)).toBe(true);
  });

  it('should return empty array if no logs found for user ID', async () => {
    const nonExistentUserId = 9999;
    const res = await request(app)
      .get(`/api/v1/logs/user/${nonExistentUserId}`)
      .expect(200); 

    expect(res.body).toEqual([]);
  });

  it('should get activity logs by event type', async () => {
    
    await request(app).post('/api/v1/logs/record').send({ user_id: 1, event_type: 'PRODUCT_VIEW', event_details: { productId: 101 } });
    await request(app).post('/api/v1/logs/record').send({ user_id: 2, event_type: 'PRODUCT_VIEW', event_details: { productId: 102 } });
    await request(app).post('/api/v1/logs/record').send({ user_id: 3, event_type: 'CART_ADD', event_details: {} }); // Otro tipo de evento

    const res = await request(app)
      .get('/api/v1/logs/type/PRODUCT_VIEW')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2); 
    expect(res.body.every((log: any) => log.event_type === 'PRODUCT_VIEW')).toBe(true);
  });

  it('should return 400 for invalid user ID format in params', async () => {
    const res = await request(app)
      .get('/api/v1/logs/user/abc') 
      .expect(400);

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Error de validación de entrada');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'userId',
          message: expect.stringContaining('"userId" must be a number'),
        }),
      ])
    );
  });
});