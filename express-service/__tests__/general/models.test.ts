import ActivityLogModel from '../../src/models/activityLogModel';
import PreferenceModel from '../../src/models/preferenceModel';
import ProductModel from '../../src/models/productModel';
import pool from '../../src/config/database'; 


jest.mock('../../src/config/database', () => ({

  execute: jest.fn((query, params) => {
    
    if (query.includes('SELECT * FROM products WHERE id = ?')) {
      if (params && params[0] === 1) {
        return Promise.resolve([[{ id: 1, name: 'Mock Product', quantity: 10, low_stock_threshold: 5 }]]);
      }
      return Promise.resolve([[]]);
    }
    if (query.includes('SELECT * FROM activity_logs WHERE user_id = ?')) {
        if (params && params[0] === 1) {
            return Promise.resolve([
                [{ id: 1, user_id: 1, event_type: 'LOGIN', event_details: {}, ip_address: '127.0.0.1', timestamp: new Date() }],
                [{ id: 2, user_id: 1, event_type: 'LOGOUT', event_details: {}, ip_address: '127.0.0.1', timestamp: new Date() }]
            ]);
        }
        return Promise.resolve([[]]);
    }
    if (query.includes('SELECT * FROM user_preferences WHERE user_id = ?')) {
        if (params && params[0] === 10) {
            return Promise.resolve([[{ user_id: 10, theme: 'dark', email_notifications: 1, dashboard_layout: null, language: 'es' }]]);
        }
        return Promise.resolve([[]]);
    }
    
    return Promise.resolve([{ affectedRows: 1, insertId: 123 }]);
  }),
  
  getConnection: jest.fn(() => ({
    beginTransaction: jest.fn(() => Promise.resolve()),
    commit: jest.fn(() => Promise.resolve()),
    rollback: jest.fn(() => Promise.resolve()),
    release: jest.fn(),

    execute: jest.fn((query, params) => {
    
      if (query.includes('SELECT id, name, quantity, low_stock_threshold FROM products WHERE id = ? FOR UPDATE')) {
        if (params && params[0] === 1) {
          return Promise.resolve([[{ id: 1, name: 'Test Product', quantity: 10, low_stock_threshold: 5 }]]);
        }
        return Promise.resolve([[]]);
      }
      if (query.includes('UPDATE products SET quantity = ? WHERE id = ?')) {
        return Promise.resolve([{ affectedRows: 1 }]);
      }
      return Promise.resolve([{ affectedRows: 1, insertId: 456 }]); 
    }),
  })),
  
  end: jest.fn(() => Promise.resolve()),
}));

const mockedPool = pool as jest.Mocked<typeof pool>;

describe('Models Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    
  });

  describe('ActivityLogModel', () => {
    it('should create an activity log', async () => {
      const log = { user_id: 1, event_type: 'TEST_EVENT', event_details: { key: 'value' }, ip_address: '127.0.0.1' };
      const insertId = await ActivityLogModel.create(log);

      expect(mockedPool.execute).toHaveBeenCalledWith(
        'INSERT INTO activity_logs (user_id, event_type, event_details, ip_address) VALUES (?, ?, ?, ?)',
        [log.user_id, log.event_type, JSON.stringify(log.event_details), log.ip_address]
      );
      expect(insertId).toBe(123); 
    });

    it('should find activity logs by user ID', async () => {
        const userId = 1;
        const logs = await ActivityLogModel.findByUserId(userId);

        expect(mockedPool.execute).toHaveBeenCalledWith(
            'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC',
            [userId]
        );
        expect(logs.length).toBe(2);
        expect(logs[0]).toHaveProperty('user_id', userId);
        expect(logs[1]).toHaveProperty('event_type', 'LOGOUT');
    });

    it('should return empty array if no logs found for user ID', async () => {
        const userId = 999; 
        const logs = await ActivityLogModel.findByUserId(userId);
        expect(logs).toEqual([]);
    });
  });

  describe('PreferenceModel', () => {
    it('should create new user preferences if none exist', async () => {
      const userId = 11; 
      const preferences = { theme: 'light', email_notifications: true };
      const result = await PreferenceModel.createOrUpdate(userId, preferences);

      
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'INSERT INTO user_preferences (user_id, theme, email_notifications, dashboard_layout, language) VALUES (?, ?, ?, ?, ?)',
        [userId, preferences.theme, preferences.email_notifications, null, 'es'] 
      );
      expect(result.insertId).toBe(123); 
    });

    it('should update existing user preferences', async () => {
      const userId = 10; 
      const preferences = { theme: 'system', dashboard_layout: 'compact' };
      const result = await PreferenceModel.createOrUpdate(userId, preferences);

     
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      expect(mockedPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_preferences SET'), 
        [preferences.theme, 1, preferences.dashboard_layout, 'es', userId]
      );
      expect(result.affectedRows).toBe(1); 
    });

    it('should find user preferences by user ID', async () => {
        const userId = 10;
        const prefs = await PreferenceModel.findByUserId(userId);

        expect(mockedPool.execute).toHaveBeenCalledWith(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [userId]
        );
        expect(prefs).toBeDefined();
        expect(prefs).toHaveProperty('user_id', userId);
        expect(prefs).toHaveProperty('theme', 'dark');
    });

    it('should return null if no user preferences found', async () => {
        const userId = 999;
        const prefs = await PreferenceModel.findByUserId(userId);
        expect(prefs).toBeNull();
    });
  });

  describe('ProductModel', () => {
    it('should create a product', async () => {
      const product = { name: 'New Item', description: null, price: 10.00, quantity: 50, low_stock_threshold: 5 };
      const insertId = await ProductModel.create(product);

      expect(mockedPool.execute).toHaveBeenCalledWith(
        'INSERT INTO products (name, description, price, quantity, low_stock_threshold) VALUES (?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.quantity, product.low_stock_threshold]
      );
      expect(insertId).toBe(123);
    });

    it('should find a product by ID', async () => {
      const productId = 1;
      const product = await ProductModel.findById(productId);

      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      expect(product).toBeDefined();
      expect(product).toHaveProperty('id', productId);
    });

    it('should return null if product not found by ID', async () => {
        const productId = 999;
        const product = await ProductModel.findById(productId);
        expect(product).toBeNull();
    });

    it('should update a product', async () => {
      const productId = 1;
      const updates = { name: 'Updated Name', price: 25.00 };
      const updated = await ProductModel.update(productId, updates);

      expect(mockedPool.execute).toHaveBeenCalledWith(
        'UPDATE products SET name = ?, price = ? WHERE id = ?',
        [updates.name, updates.price, productId]
      );
      expect(updated).toBe(true);
    });

    it('should return false if no fields provided for update', async () => {
        const productId = 1;
        const updates = {}; 
        const updated = await ProductModel.update(productId, updates);
        expect(mockedPool.execute).not.toHaveBeenCalled(); 
        expect(updated).toBe(false);
    });

    it('should delete a product', async () => {
      const productId = 1;
      const deleted = await ProductModel.delete(productId);

      expect(mockedPool.execute).toHaveBeenCalledWith(
        'DELETE FROM products WHERE id = ?',
        [productId]
      );
      expect(deleted).toBe(true);
    });

    it('should consume product stock', async () => {
      const productId = 1;
      const quantityToConsume = 5;
      const connectionMock = mockedPool.getConnection as jest.Mock;
      const mockExecute = connectionMock.mock.results[0].value.execute as jest.Mock;

      
      mockExecute.mockImplementationOnce((query, params) => {
        if (query.includes('SELECT id, name, quantity, low_stock_threshold FROM products WHERE id = ? FOR UPDATE')) {
          return Promise.resolve([[{ id: productId, name: 'Product X', quantity: 10, low_stock_threshold: 5 }]]);
        }
        return Promise.resolve([{ affectedRows: 1 }]);
      });
      
      mockExecute.mockImplementationOnce((query, params) => {
        if (query.includes('UPDATE products SET quantity = ? WHERE id = ?')) {
          return Promise.resolve([{ affectedRows: 1 }]);
        }
        return Promise.resolve([]);
      });

  
      const findByIdSpy = jest.spyOn(ProductModel, 'findById');
      findByIdSpy.mockResolvedValueOnce({
        id: productId, name: 'Product X', description: null, price: 10, quantity: 5, low_stock_threshold: 5, updated_at: new Date()
      });

      const updatedProduct = await ProductModel.consumeProduct(productId, quantityToConsume);

      expect(mockedPool.getConnection).toHaveBeenCalledTimes(1);
      const connection = await mockedPool.getConnection();
      expect(connection.beginTransaction).toHaveBeenCalledTimes(1);
      expect(connection.execute).toHaveBeenCalledWith(
        'SELECT id, name, quantity, low_stock_threshold FROM products WHERE id = ? FOR UPDATE',
        [productId]
      );
      expect(connection.execute).toHaveBeenCalledWith(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [5, productId]
      );
      expect(connection.commit).toHaveBeenCalledTimes(1);
      expect(connection.release).toHaveBeenCalledTimes(1);
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct!.quantity).toBe(5);
      findByIdSpy.mockRestore(); 

    });

    it('should throw error if insufficient stock when consuming product', async () => {
      const productId = 1;
      const quantityToConsume = 15;
      const connectionMock = mockedPool.getConnection as jest.Mock;
      const mockExecute = connectionMock.mock.results[0].value.execute as jest.Mock;

    
      mockExecute.mockImplementationOnce((query, params) => {
        if (query.includes('SELECT id, name, quantity, low_stock_threshold FROM products WHERE id = ? FOR UPDATE')) {
          return Promise.resolve([[{ id: productId, name: 'Product Y', quantity: 10, low_stock_threshold: 5 }]]);
        }
        return Promise.resolve([]);
      });

      await expect(ProductModel.consumeProduct(productId, quantityToConsume)).rejects.toThrow('Stock insuficiente para consumir la cantidad solicitada.');
      const connection = await mockedPool.getConnection();
      expect(connection.rollback).toHaveBeenCalledTimes(1);
    });

    it('should add product stock', async () => {
      const productId = 1;
      const quantityToAdd = 10;
      const connectionMock = mockedPool.getConnection as jest.Mock;
      const mockExecute = connectionMock.mock.results[0].value.execute as jest.Mock;

     
      mockExecute.mockImplementationOnce((query, params) => {
        if (query.includes('SELECT id, name, quantity FROM products WHERE id = ? FOR UPDATE')) {
          return Promise.resolve([[{ id: productId, name: 'Product Z', quantity: 20 }]]);
        }
        return Promise.resolve([]);
      });
      
      mockExecute.mockImplementationOnce((query, params) => {
        if (query.includes('UPDATE products SET quantity = ? WHERE id = ?')) {
          return Promise.resolve([{ affectedRows: 1 }]);
        }
        return Promise.resolve([]);
      });

     
      const findByIdSpy = jest.spyOn(ProductModel, 'findById');
      findByIdSpy.mockResolvedValueOnce({
        id: productId, name: 'Product Z', description: null, price: 10, quantity: 30, low_stock_threshold: 5, updated_at: new Date()
      });


      const updatedProduct = await ProductModel.addProductStock(productId, quantityToAdd);

      expect(mockedPool.getConnection).toHaveBeenCalledTimes(1);
      const connection = await mockedPool.getConnection();
      expect(connection.beginTransaction).toHaveBeenCalledTimes(1);
      expect(connection.execute).toHaveBeenCalledWith(
        'SELECT id, name, quantity FROM products WHERE id = ? FOR UPDATE',
        [productId]
      );
      expect(connection.execute).toHaveBeenCalledWith(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [30, productId]
      );
      expect(connection.commit).toHaveBeenCalledTimes(1);
      expect(connection.release).toHaveBeenCalledTimes(1);
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct!.quantity).toBe(30);
      findByIdSpy.mockRestore();
    });

    it('should get low stock products', async () => {
        mockedPool.execute.mockResolvedValueOnce([
            [{ id: 1, name: 'Low Stock 1', quantity: 2, low_stock_threshold: 5 }],
            [{ id: 2, name: 'Low Stock 2', quantity: 1, low_stock_threshold: 3 }]
        ]);

        const lowStockProducts = await ProductModel.getLowStockProducts();

        expect(mockedPool.execute).toHaveBeenCalledWith(
            'SELECT * FROM products WHERE quantity <= low_stock_threshold ORDER BY quantity ASC',
            []
        );
        expect(lowStockProducts.length).toBe(2);
        expect(lowStockProducts[0]).toHaveProperty('name', 'Low Stock 1');
    });
  });
});