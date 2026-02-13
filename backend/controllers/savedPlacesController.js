import UserSavedPlaces from '../models/UserSavedPlaces.js';

// @desc    Save a place for the user
// @route   POST /api/saved-places
// @access  Private
export const savePlace = async (req, res) => {
    try {
        const { placeName, placeDetails } = req.body;

        if (!placeName) {
            return res.status(400).json({ message: 'Place name is required' });
        }

        // Check if already saved
        const existing = await UserSavedPlaces.findOne({
            where: { userId: req.user.id, placeName }
        });

        if (existing) {
            return res.status(400).json({ message: 'Place already saved' });
        }

        const savedPlace = await UserSavedPlaces.create({
            userId: req.user.id,
            placeName,
            placeDetails: placeDetails || {},
        });

        res.status(201).json(savedPlace);
    } catch (error) {
        console.error('Save place error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all saved places for the user
// @route   GET /api/saved-places
// @access  Private
export const getSavedPlaces = async (req, res) => {
    try {
        const places = await UserSavedPlaces.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(places);
    } catch (error) {
        console.error('Get saved places error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a saved place
// @route   DELETE /api/saved-places/:id
// @access  Private
export const deleteSavedPlace = async (req, res) => {
    try {
        const place = await UserSavedPlaces.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!place) {
            return res.status(404).json({ message: 'Saved place not found' });
        }

        await place.destroy();
        res.json({ message: 'Place removed from saved' });
    } catch (error) {
        console.error('Delete saved place error:', error);
        res.status(500).json({ message: error.message });
    }
};
