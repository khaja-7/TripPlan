const STORAGE_KEY_TRIPS = 'tripplan_trips';

export const storageService = {
  getTrips: (userId) => {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!raw) return [];
    const allTrips = JSON.parse(raw);
    return allTrips.filter(t => t.userId === userId);
  },

  getTrip: (tripId) => {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!raw) return null;
    const allTrips = JSON.parse(raw);
    return allTrips.find(t => t.id === tripId) || null;
  },

  saveTrip: (trip) => {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    let allTrips = raw ? JSON.parse(raw) : [];

    const index = allTrips.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      allTrips[index] = trip;
    } else {
      allTrips.push(trip);
    }

    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
  },

  deleteTrip: (tripId) => {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!raw) return;
    let allTrips = JSON.parse(raw);
    allTrips = allTrips.filter(t => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(allTrips));
  }
};
