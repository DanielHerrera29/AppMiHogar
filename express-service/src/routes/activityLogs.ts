
// import { Router } from 'express';
// import ActivityLogController from '../controllers/activityLogController';
// import { validateRequest } from '../middlewares/validateRequest';
// import {
//   createActivityLogSchema,
//   getActivityLogsByUserIdSchema, 
//   getActivityLogsByEventTypeSchema 
// } from '../validations/schemas';

// const router = Router(); 


// router.post('/record', validateRequest(createActivityLogSchema, 'body'), ActivityLogController.recordLog);


// router.get('/user/:userId', validateRequest(getActivityLogsByUserIdSchema, 'params'), ActivityLogController.getLogsByUserId);


// router.get('/type/:eventType', validateRequest(getActivityLogsByEventTypeSchema, 'params'), ActivityLogController.getLogsByEventType);

// export default router; 
// src/routes/activityLogs.ts
import { Router } from 'express';
import ActivityLogController from '../controllers/activityLogController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createActivityLogSchema,
  getActivityLogsByUserIdSchema,
  getActivityLogsByEventTypeSchema
} from '../validations/schemas';

const router = Router();

router.post('/record', validateRequest(createActivityLogSchema, 'body'), ActivityLogController.recordLog);
router.get('/user/:userId', validateRequest(getActivityLogsByUserIdSchema, 'params'), ActivityLogController.getLogsByUserId);
router.get('/type/:eventType', validateRequest(getActivityLogsByEventTypeSchema, 'params'), ActivityLogController.getLogsByEventType);

export default router;