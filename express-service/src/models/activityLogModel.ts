
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise'; 
import pool from '../config/database';
import { ActivityLog } from '../types';

class ActivityLogModel {
  static async create(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<number> {

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO activity_logs (user_id, event_type, event_details, ip_address) VALUES (?, ?, ?, ?)',
      [log.user_id, log.event_type, JSON.stringify(log.event_details), log.ip_address]
    );
    return result.insertId;
  }

  static async findByUserId(userId: number): Promise<ActivityLog[]> {

    const [rows] = await pool.execute<ActivityLog[]>( 
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC',
      [userId]
    );
    return rows;
  }

  static async findByEventType(eventType: string): Promise<ActivityLog[]> {
  
    const [rows] = await pool.execute<ActivityLog[]>( 
      'SELECT * FROM activity_logs WHERE event_type = ? ORDER BY timestamp DESC',
      [eventType]
    );
    return rows;
  }
}

export default ActivityLogModel;