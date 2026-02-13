import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

// @desc    Create activity for a trip
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
    try {
        const { tripId, name, details, price, imageUrl, geoCoordinates } = req.body;

        // Verify trip belongs to user
        const trip = await Trip.findOne({
            where: { id: tripId, userId: req.user.id }
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const activity = await Activity.create({
            tripId,
            userId: req.user.id,
            name: name || 'Unnamed Activity',
            details: details || '',
            price: price || 0,
            imageUrl: imageUrl || null,
            geoCoordinates: geoCoordinates || null,
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all activities for a trip
// @route   GET /api/activities/trip/:tripId
// @access  Private
export const getActivitiesByTrip = async (req, res) => {
    try {
        // Verify trip belongs to user
        const trip = await Trip.findOne({
            where: { id: req.params.tripId, userId: req.user.id }
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const activities = await Activity.findAll({
            where: { tripId: req.params.tripId },
            order: [['createdAt', 'ASC']],
        });

        res.status(200).json(activities);
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await activity.destroy();
        res.json({ message: 'Activity removed' });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({ message: error.message });
    }
};
