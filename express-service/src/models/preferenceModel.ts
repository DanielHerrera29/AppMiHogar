// src/models/preferenceModel.ts

import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database';
import { UserPreference } from '../types'; // Assuming you have a UserPreference type defined

class PreferenceModel {
  static async findByUserId(userId: number): Promise<UserPreference | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );
    // Cast to UserPreference as RowDataPacket doesn't have all properties
    return rows.length > 0 ? (rows[0] as UserPreference) : null;
  }

  static async createOrUpdate(userId: number, preferences: Partial<Omit<UserPreference, 'user_id' | 'created_at' | 'updated_at'>>): Promise<ResultSetHeader> {
    // This is an example of an UPSERT operation.
    // Adjust your SQL query based on your actual table structure and desired behavior.
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO user_preferences (user_id, theme, email_notifications, dashboard_layout, language)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       theme = VALUES(theme),
       email_notifications = VALUES(email_notifications),
       dashboard_layout = VALUES(dashboard_layout),
       language = VALUES(language)`,
      [
        userId,
        preferences.theme || null,
        preferences.email_notifications !== undefined ? preferences.email_notifications : null,
        preferences.dashboard_layout || null,
        preferences.language || null
      ]
    );
    return result;
  }

  // You might want to add other methods like update, delete, etc.
}

export default PreferenceModel; // <<-- This line was added/confirmed to ensure default export