
import express, { Request, Response, NextFunction } from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mainRoutes from './routes';
import { AppError, ValidationError } from './utils/appErrors'; 


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());


app.use('/api/v1', mainRoutes);


app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor.`, 404));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

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

    console.error('ERROR (no operacional):', err); 
  } else {
   
    console.error('ERROR (desconocido):', err);
    message = 'Un error desconocido ha ocurrido.';
  }

 
  res.status(statusCode).json({
    status: status,
    message: message,
    ...(details && { details: details }), 
    
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express.js escuchando en http://localhost:${PORT}`);
});