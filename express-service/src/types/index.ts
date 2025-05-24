
import { RowDataPacket } from 'mysql2/promise';


export interface ActivityLog extends RowDataPacket {
  id: number;
  user_id: number;
  event_type: string;
  event_details: Record<string, any>; 
  ip_address: string;
  timestamp: Date;
}

export interface UserPreference extends RowDataPacket {
  user_id: number;
  theme: string;
  email_notifications: boolean;
  dashboard_layout: string | null;
  language: string;
}

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number; 
  low_stock_threshold: number; 
  updated_at: Date;
}