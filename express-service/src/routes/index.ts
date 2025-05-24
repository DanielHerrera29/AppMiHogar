
import { Router } from 'express';
import activityLogsRoutes from './activityLogs';
import preferencesRoutes from './preferences';
import productsRoutes from './products'; 

const router = Router();

router.use('/logs', activityLogsRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/products', productsRoutes); 

export default router;