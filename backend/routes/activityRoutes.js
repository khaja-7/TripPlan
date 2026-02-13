import express from 'express';
import { createActivity, getActivitiesByTrip, deleteActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createActivity);
router.get('/trip/:tripId', protect, getActivitiesByTrip);
router.delete('/:id', protect, deleteActivity);

export default router;
