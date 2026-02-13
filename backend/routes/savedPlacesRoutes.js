import express from 'express';
import { savePlace, getSavedPlaces, deleteSavedPlace } from '../controllers/savedPlacesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, savePlace);
router.get('/', protect, getSavedPlaces);
router.delete('/:id', protect, deleteSavedPlace);

export default router;
