
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database';
import { Product } from '../types'; 

class ProductModel {

  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO products (name, description, price, quantity, low_stock_threshold) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.quantity, product.low_stock_threshold]
    );
    return result.insertId;
  }

  
  static async findById(id: number): Promise<Product | null> {
    const [rows] = await pool.execute<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }


  static async findAll(): Promise<Product[]> {
    const [rows] = await pool.execute<Product[]>(
      'SELECT * FROM products ORDER BY name ASC',
      []
    );
    return rows;
  }

 
  static async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (product.name !== undefined) { fields.push('name = ?'); values.push(product.name); }
    if (product.description !== undefined) { fields.push('description = ?'); values.push(product.description); }
    if (product.price !== undefined) { fields.push('price = ?'); values.push(product.price); }
    if (product.quantity !== undefined) { fields.push('quantity = ?'); values.push(product.quantity); }
    if (product.low_stock_threshold !== undefined) { fields.push('low_stock_threshold = ?'); values.push(product.low_stock_threshold); }

    if (fields.length === 0) {
      return false; 
    }

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  
  static async consumeProduct(productId: number, quantityToConsume: number): Promise<Product | null> {
    if (quantityToConsume <= 0) {
      throw new Error('La cantidad a consumir debe ser mayor que cero.');
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();


      const [products] = await connection.execute<Product[]>(
        'SELECT id, name, quantity, low_stock_threshold FROM products WHERE id = ? FOR UPDATE', 
        [productId]
      );

      if (products.length === 0) {
        await connection.rollback();
        return null; 
      }

      const product = products[0];
      if (product.quantity < quantityToConsume) {
        await connection.rollback();
        throw new Error('Stock insuficiente para consumir la cantidad solicitada.');
      }

     
      const newQuantity = product.quantity - quantityToConsume;
      await connection.execute(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [newQuantity, productId]
      );

      await connection.commit();

      
      const updatedProduct = await this.findById(productId);
      if (updatedProduct && updatedProduct.quantity <= updatedProduct.low_stock_threshold) {
        console.warn(`ALERTA DE BAJO STOCK: El producto '${updatedProduct.name}' (ID: ${updatedProduct.id}) tiene una cantidad de ${updatedProduct.quantity}, por debajo del umbral de ${updatedProduct.low_stock_threshold}.`);
      
      }

      return updatedProduct;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  
  static async addProductStock(productId: number, quantityToAdd: number): Promise<Product | null> {
    if (quantityToAdd <= 0) {
      throw new Error('La cantidad a añadir debe ser mayor que cero.');
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

     
      const [products] = await connection.execute<Product[]>(
        'SELECT id, name, quantity FROM products WHERE id = ? FOR UPDATE', 
        [productId]
      );

      if (products.length === 0) {
        await connection.rollback();
        return null; 
      }

      const product = products[0];
      const newQuantity = product.quantity + quantityToAdd;

   
      await connection.execute(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [newQuantity, productId]
      );

      await connection.commit();
      return await this.findById(productId); 

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  
  static async getLowStockProducts(): Promise<Product[]> {
    const [rows] = await pool.execute<Product[]>(
      'SELECT * FROM products WHERE quantity <= low_stock_threshold ORDER BY quantity ASC',
      []
    );
    return rows;
  }
}

export default ProductModel;