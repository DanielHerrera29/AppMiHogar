import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD; 
const DB_NAME = process.env.DB_NAME || 'your_database_name'; 


if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error('Error: Las variables de entorno de la base de datos (DB_HOST, DB_USER, DB_NAME) no están definidas en .env.');
   process.exit(1);
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true, 
  connectionLimit: 10,      
  queueLimit: 0             
});


const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa.');
    connection.release(); 
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
 
    process.exit(1);
  }
};


testDatabaseConnection();


export default pool;