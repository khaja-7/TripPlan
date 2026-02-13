
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/tripService';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to fetch trips", error);
        setNotification("Failed to load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id, title) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This will permanently remove the trip plan.`
      )
    ) {
      try {
        await tripService.deleteTrip(id);
        setTrips((prevTrips) => prevTrips.filter((t) => t.id !== id));
        setNotification(`Trip "${title}" deleted successfully.`);
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error("Failed to delete trip", error);
        setNotification("Failed to delete trip.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6 md:p-10">
      <div className="max-w-7xl mx-auto relative">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-xl text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-white/10">
            <svg
              className="w-5 h-5 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium text-sm">{notification}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Your Adventures
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Manage and plan your upcoming journeys.
            </p>
          </div>

          <Link
            to="/create-trip"
            className="flex items-center gap-2 bg-teal-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Plan New Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-md border-2 border-dashed border-white/10 rounded-3xl p-20 text-center animate-fade-in">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ✈️
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No trips planned yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Start your journey by creating your first itinerary and tracking your budget with AI.
            </p>

            <Link
              to="/create-trip"
              className="inline-block bg-teal-500/10 text-teal-400 px-8 py-3 rounded-xl font-bold hover:bg-teal-500/20 transition-colors border border-teal-500/20"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-white/[0.03] backdrop-blur-md rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 animate-fade-in"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={trip.imageUrl || `https://picsum.photos/seed/${trip.id}/800/600`}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                    {trip.destination}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors capitalize">
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-2.5 text-gray-500 mb-6 font-medium text-sm">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>

                    {new Date(trip.startDate).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    -{' '}
                    {new Date(trip.endDate).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600 font-bold uppercase tracking-wider">
                        Budget Tracking
                      </span>
                      <span className="font-bold text-gray-300">
                        ${trip.budget?.spent?.toFixed(2) || '0.00'} / ${trip.budget?.total || '0'}
                      </span>
                    </div>

                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${trip.budget?.spent > trip.budget?.total
                          ? 'bg-rose-500'
                          : 'bg-teal-500'
                          }`}
                        style={{
                          width: `${Math.min(
                            (trip.budget?.spent / trip.budget?.total) * 100 || 0,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="flex-grow text-center bg-teal-500/10 text-teal-400 py-3.5 rounded-2xl font-extrabold text-sm hover:bg-teal-500 hover:text-black transition-all active:scale-95 border border-teal-500/20 hover:border-teal-500"
                    >
                      View Plan
                    </Link>

                    <button
                      onClick={() => handleDelete(trip.id, trip.title)}
                      className="p-3.5 rounded-2xl text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 flex items-center justify-center active:scale-90"
                      aria-label={`Delete trip ${trip.title}`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
