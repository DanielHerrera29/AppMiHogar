
import { Router } from 'express';
import ProductController from '../controllers/productController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createProductSchema,
  getProductByIdSchema,
  updateProductSchema,
  consumeProductSchema,
  addProductStockSchema
} from '../validations/schemas';

const router = Router(); 


router.post('/', validateRequest(createProductSchema, 'body'), ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', validateRequest(getProductByIdSchema, 'params'), ProductController.getProductById);
router.put('/:id', validateRequest(updateProductSchema, 'body'), ProductController.updateProduct);
router.delete('/:id', validateRequest(getProductByIdSchema, 'params'), ProductController.deleteProduct);

router.post('/:id/consume', validateRequest(consumeProductSchema, 'body'), ProductController.consumeProduct);
router.post('/:id/add_stock', validateRequest(addProductStockSchema, 'body'), ProductController.addProductStock);
router.get('/low_stock', ProductController.getLowStockProducts);

export default router; 