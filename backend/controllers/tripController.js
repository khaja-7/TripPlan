import Trip from '../models/Trip.js';
import Activity from '../models/Activity.js';
import UserSavedPlaces from '../models/UserSavedPlaces.js';

// @desc    Create a trip
// @route   POST /api/trips
// @access  Public
export const createTrip = async (req, res) => {
    try {
        const { location, date, plan, budget, tripDetails } = req.body;

        if (!location) {
            res.status(400);
            throw new Error('Please add a location');
        }

        const trip = await Trip.create({
            userId: req.user.id,
            location,
            date,
            plan: JSON.stringify(plan),
            budget,
            tripDetails
        });

        // Also save destination as a user saved place
        try {
            const existing = await UserSavedPlaces.findOne({
                where: { userId: req.user.id, placeName: location }
            });
            if (!existing) {
                await UserSavedPlaces.create({
                    userId: req.user.id,
                    placeName: location,
                    placeDetails: { budget, date, tripId: trip.id }
                });
            }
        } catch (e) {
            console.log('Could not save place:', e.message);
        }

        res.status(201).json(trip);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: {
                userId: req.user.id,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (trip) {
            if (typeof trip.plan === 'string') {
                try {
                    trip.plan = JSON.parse(trip.plan);
                } catch (e) { }
            }
            res.json(trip);
        } else {
            res.status(404);
            throw new Error('Trip not found');
        }
    } catch (error) {
        res.status(404);
        throw new Error('Trip not found');
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (trip) {
            const { location, date, plan, budget, tripDetails } = req.body;

            trip.location = location || trip.location;
            trip.date = date || trip.date;
            trip.budget = budget || trip.budget;

            if (plan) {
                trip.plan = typeof plan === 'object' ? JSON.stringify(plan) : plan;
            }

            trip.tripDetails = tripDetails || trip.tripDetails;

            const updatedTrip = await trip.save();

            // Sync activities to Activities table
            try {
                const parsedDetails = typeof tripDetails === 'string' ? JSON.parse(tripDetails) : tripDetails;
                if (parsedDetails?.itinerary) {
                    // Clear old activities for this trip
                    await Activity.destroy({ where: { tripId: trip.id } });

                    // Insert current activities
                    const activities = [];
                    for (const day of parsedDetails.itinerary) {
                        if (day.activities && day.activities.length > 0) {
                            for (const act of day.activities) {
                                activities.push({
                                    tripId: trip.id,
                                    userId: req.user.id,
                                    name: act.location || act.name || 'Activity',
                                    details: act.notes || '',
                                    price: act.cost || 0,
                                });
                            }
                        }
                    }
                    if (activities.length > 0) {
                        await Activity.bulkCreate(activities);
                    }
                }
            } catch (syncErr) {
                console.log('Activity sync note:', syncErr.message);
            }

            res.json(updatedTrip);
        } else {
            res.status(404);
            throw new Error('Trip not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (trip) {
            await trip.destroy();
            res.json({ message: 'Trip removed' });
        } else {
            res.status(404);
            throw new Error('Trip not found');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};
