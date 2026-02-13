
import axios from 'axios';

// const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/trips' || 'http://localhost:5001/api/trips';
const API_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001') + '/api/trips';

const getToken = () => localStorage.getItem('token');

const tripService = {
    createTrip: async (tripData) => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };

        // Map frontend structure to backend structure if needed
        // Frontend uses: title, destination, startDate, endDate, budget, itinerary
        // Backend uses: location (destination), date (startDate), plan (itinerary?), budget (total?), tripDetails (full obj)

        // Strategy: Store the FULL frontend object into 'tripDetails' JSON column
        // And map key fields to columns for easier querying

        const backendPayload = {
            location: tripData.destination,
            date: tripData.startDate,
            budget: JSON.stringify(tripData.budget), // or just total
            tripDetails: tripData // Store EVERYTHING here
        };

        const response = await axios.post(API_URL, backendPayload, config);
        return response.data;
    },

    getAllTrips: async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };
        const response = await axios.get(API_URL, config);

        // Backend returns array of DB rows.
        // We want to return the 'tripDetails' property primarily, but enriched with DB ID
        return response.data.map(trip => {
            // dynamic check if tripDetails is string or object (sequelize sometimes creates it as object)
            let details = trip.tripDetails;
            if (typeof details === 'string') {
                try { details = JSON.parse(details); } catch (e) { }
            }

            return {
                ...details,
                id: trip.id, // Use DB ID
                // format dates if needed
            };
        });
    },

    getTrip: async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };
        const response = await axios.get(`${API_URL}/${id}`, config);

        let details = response.data.tripDetails;
        if (typeof details === 'string') {
            try { details = JSON.parse(details); } catch (e) { }
        }

        return {
            ...details,
            id: response.data.id
        };
    },

    updateTrip: async (trip) => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };

        const backendPayload = {
            location: trip.destination,
            date: trip.startDate,
            budget: JSON.stringify(trip.budget),
            tripDetails: trip
        };

        const response = await axios.put(`${API_URL}/${trip.id}`, backendPayload, config);
        return response.data;
    },

    deleteTrip: async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };
        const response = await axios.delete(`${API_URL}/${id}`, config);
        return response.data;
    },

    // Keep legacy methods for compatibility if needed, or replace them
    saveTrip: async (trip) => {
        // Logic to decide if create or update
        // If trip has a numeric ID (from DB), it's update. If it has 'trip-xyz', it's new?
        // Actually CreateTrip generates 'trip-timestamp'.
        // Better to handle this at component level, but for now:
        if (typeof trip.id === 'number') {
            return await tripService.updateTrip(trip);
        } else {
            return await tripService.createTrip(trip);
        }
    }
};

export { tripService };
