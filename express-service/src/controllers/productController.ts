
import { Request, Response, NextFunction } from 'express';
import ProductModel from '../models/productModel';
import { NotFoundError, AppError, ValidationError } from '../utils/appErrors';
import { Product } from '../types'; 

class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { name, description, price, quantity, low_stock_threshold } = req.body;

    try {
      const newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name,
        description: description || null,
        price,
        quantity,
        low_stock_threshold,
      };
      const productId = await ProductModel.create(newProduct);
      return res.status(201).json({ message: 'Producto creado exitosamente', productId });
    } catch (error) {
      console.error('Error al crear producto:', error);
      next(new AppError('Error interno del servidor al crear producto.', 500));
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(parseInt(id, 10));
      if (!product) {
        return next(new NotFoundError('Producto no encontrado.'));
      }
      return res.json(product);
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      next(new AppError('Error interno del servidor al obtener producto.', 500));
    }
  }

  static async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const products = await ProductModel.findAll();
      return res.json(products);
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      next(new AppError('Error interno del servidor al obtener productos.', 500));
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id } = req.params;
    const updates = req.body; 

    try {
      const updated = await ProductModel.update(parseInt(id, 10), updates);
      if (!updated) {
        const product = await ProductModel.findById(parseInt(id, 10));
        if (!product) {
          return next(new NotFoundError('Producto no encontrado.'));
        }
        return res.json({ message: 'Producto procesado (posiblemente sin cambios).' });
      }
      return res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      next(new AppError('Error interno del servidor al actualizar producto.', 500));
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id } = req.params;
    try {
      const deleted = await ProductModel.delete(parseInt(id, 10));
      if (!deleted) {
        return next(new NotFoundError('Producto no encontrado.'));
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      next(new AppError('Error interno del servidor al eliminar producto.', 500));
    }
  }

  static async consumeProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const updatedProduct = await ProductModel.consumeProduct(parseInt(id, 10), quantity);
      if (!updatedProduct) {
        return next(new NotFoundError('Producto no encontrado.'));
      }
      return res.json({ message: `Consumidas ${quantity} unidades del producto '${updatedProduct.name}'. Nuevo stock: ${updatedProduct.quantity}.`, product: updatedProduct });
    } catch (error: any) {
      console.error('Error al consumir producto:', error);
      if (error.message.includes('Stock insuficiente')) {
        return next(new ValidationError(error.message)); 
      }
      next(new AppError('Error interno del servidor al consumir producto.', 500));
    }
  }

  static async addProductStock(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const updatedProduct = await ProductModel.addProductStock(parseInt(id, 10), quantity);
      if (!updatedProduct) {
        return next(new NotFoundError('Producto no encontrado.'));
      }
      return res.json({ message: `Añadidas ${quantity} unidades al producto '${updatedProduct.name}'. Nuevo stock: ${updatedProduct.quantity}.`, product: updatedProduct });
    } catch (error) {
      console.error('Error al añadir stock:', error);
      next(new AppError('Error interno del servidor al añadir stock.', 500));
    }
  }

  static async getLowStockProducts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const products = await ProductModel.getLowStockProducts();
      return res.json(products);
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      next(new AppError('Error interno del servidor al obtener productos con bajo stock.', 500));
    }
  }
}

export default ProductController;
