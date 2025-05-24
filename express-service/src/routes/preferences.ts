
// import { Router } from 'express';
// import PreferenceController from '../controllers/preferenceController';
// import { validateRequest } from '../middlewares/validateRequest';
// import { getUserPreferencesSchema, createOrUpdateUserPreferencesSchema } from '../validations/schemas';

// const router = Router(); 

// router.get('/:userId', validateRequest(getUserPreferencesSchema, 'params'), PreferenceController.getUserPreferences);
// router.put('/:userId', validateRequest(createOrUpdateUserPreferencesSchema, 'body'), PreferenceController.createOrUpdatePreferences);

// export default router; 
// src/routes/preferences.ts
import { Router } from 'express';
import PreferenceController from '../controllers/preferenceController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getUserPreferencesSchema,
  createOrUpdateUserPreferencesBodySchema, // Renamed schema
  userIdParamSchema // New schema for userId in params
} from '../validations/schemas';

const router = Router();

// GET /preferences/:userId
// Validate userId from params using userIdParamSchema
// getUserPreferencesSchema can be empty if no other query params are expected.
router.get(
  '/:userId',
  validateRequest(userIdParamSchema, 'params'),
  PreferenceController.getUserPreferences
);

// PUT /preferences/:userId
// Validate userId from params using userIdParamSchema
// Validate the request body using createOrUpdateUserPreferencesBodySchema
router.put(
  '/:userId',
  validateRequest(userIdParamSchema, 'params'),
  validateRequest(createOrUpdateUserPreferencesBodySchema, 'body'),
  PreferenceController.createOrUpdatePreferences
);

export default router;