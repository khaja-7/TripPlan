
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, DollarSign,
  Plus, Sparkles, Clock, Navigation,
  CreditCard, PieChart, CheckCircle, X, Trash2
} from 'lucide-react';
// import { storageService } from '../services/storage';
import { tripService } from '../services/tripService';
import { getGeminiSuggestions } from '../services/gemini';

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [destinationImage, setDestinationImage] = useState(null);

  // New Activity State
  const [newActivity, setNewActivity] = useState({
    time: '10:00',
    location: '',
    cost: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (id) {
          const data = await tripService.getTrip(id);
          if (data) setTrip(data);
        }
      } catch (error) {
        console.error("Failed to load trip:", error);
      }
    };
    fetchTrip();
  }, [id]);

  // Fetch destination image (Unsplash → Wikipedia fallback)
  useEffect(() => {
    if (!trip?.destination) return;

    const fetchImage = async () => {
      const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

      // Try Unsplash API first (best quality)
      if (unsplashKey) {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(trip.destination + ' travel landscape')}&per_page=1&orientation=landscape&client_id=${unsplashKey}`
          );
          const data = await res.json();
          if (data?.results?.[0]?.urls?.full) {
            setDestinationImage(data.results[0].urls.full);
            return;
          }
        } catch (err) {
          console.log('Unsplash fetch failed:', err);
        }
      }

      // Fallback: Wikipedia
      const searchTerms = [trip.destination, `${trip.destination} city`];
      for (const term of searchTerms) {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
          );
          const data = await res.json();
          if (data?.originalimage?.source) {
            setDestinationImage(data.originalimage.source);
            return;
          }
        } catch (err) {
          console.log(`Wikipedia fetch failed for "${term}":`, err);
        }
      }
    };
    fetchImage();
  }, [trip?.destination]);

  if (!trip) return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading your adventure...</p>
      </div>
    </div>
  );

  const totalSpent = (trip?.budget?.spent || 0) +
    (trip?.budget?.estimatedAccommodation || 0) +
    (trip?.budget?.estimatedTransport || 0);

  const budgetProgress = (totalSpent / trip?.budget?.total) * 100 || 0;
  const daysDiff = trip?.startDate && trip?.endDate ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1 : 1;

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!trip || selectedDay === null) return;

    const activity = {
      id: `act-${Date.now()}`,
      ...newActivity
    };

    const newTrip = { ...trip };
    const targetDay = newTrip.itinerary.find((d) => d.dayNumber === selectedDay);
    if (targetDay) {
      targetDay.activities.push(activity);
      newTrip.budget.spent += Number(activity.cost);

      try {
        await tripService.updateTrip(newTrip);
        setTrip(newTrip);
        setIsModalOpen(false);
        setNewActivity({ time: '10:00', location: '', cost: 0, notes: '' });
      } catch (error) {
        console.error("Failed to save activity:", error);
        alert("Failed to save. Please try again.");
      }
    }
  };

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const suggestions = await getGeminiSuggestions(
        trip.destination,
        trip.budget.total,
        daysDiff,
        trip.travelers || { adults: 1, children: 0 }
      );
      setAiSuggestions(suggestions);

      // Save estimates to trip budget automatically
      if (suggestions.estimatedAccommodationCost || suggestions.estimatedTransportCost) {
        const updatedTrip = { ...trip };
        updatedTrip.budget = {
          ...updatedTrip.budget,
          estimatedAccommodation: suggestions.estimatedAccommodationCost || 0,
          estimatedTransport: suggestions.estimatedTransportCost || 0
        };

        await tripService.updateTrip(updatedTrip);
        setTrip(updatedTrip);
      }

    } catch (e) {
      console.error("AI Generation Error:", e);
      alert('AI generation failed. Please check your API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAiActivity = async (activity, day) => {
    const newTrip = { ...trip };
    const targetDay = newTrip.itinerary.find((d) => d.dayNumber === day);
    if (targetDay) {
      targetDay.activities.push({ ...activity, id: `act-${Date.now()}` });
      newTrip.budget.spent += activity.cost;

      try {
        await tripService.updateTrip(newTrip);
        setTrip(newTrip);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Failed to save AI activity:", error);
      }
    }
  };

  const handleDeleteActivity = async (dayNumber, activityId) => {
    if (!window.confirm('Are you sure you want to remove this activity?')) return;

    const updatedTrip = { ...trip };
    const targetDay = updatedTrip.itinerary.find((d) => d.dayNumber === dayNumber);
    if (targetDay) {
      const activityToRemove = targetDay.activities.find((a) => a.id === activityId);
      if (activityToRemove) {
        updatedTrip.budget.spent = Math.max(0, (updatedTrip.budget.spent || 0) - Number(activityToRemove.cost || 0));
        targetDay.activities = targetDay.activities.filter((a) => a.id !== activityId);

        try {
          await tripService.updateTrip(updatedTrip);
          setTrip(updatedTrip);
        } catch (error) {
          console.error('Failed to delete activity:', error);
          alert('Failed to delete. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20">

      {/* Immersive Header */}
      <div className="relative h-[40vh] min-h-[300px] lg:h-[50vh] w-full overflow-hidden">
        <img
          src={destinationImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
          alt={trip.destination}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />

        <div className="absolute top-0 left-0 w-full p-6 z-50">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-black/30">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-end justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-2 text-blue-300 font-bold uppercase tracking-wider text-sm justify-end md:justify-start mr-2 md:mr-0">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                  <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white border border-white/20">
                    {daysDiff} Days
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                  {trip.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 text-lg">
                  <MapPin className="w-5 h-5" />
                  {trip.destination}
                </div>
              </div>

              {/* Header Budget Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl min-w-[280px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-200 text-sm font-medium">Budget Used</span>
                  <span className={`font-bold ${budgetProgress > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {Math.round(budgetProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    className={`h-full rounded-full ${budgetProgress > 100 ? 'bg-red-500/100' : 'bg-emerald-500'}`}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white font-bold">${totalSpent}</span>
                  <span className="text-gray-600">/ ${trip.budget.total}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        {/* Navigation Tabs */}
        <div className="bg-white/5 rounded-2xl shadow-xl shadow-slate-200/50 p-2 mb-8 flex justify-between md:justify-start gap-2 overflow-x-auto">
          {[
            { id: 'itinerary', icon: Calendar, label: 'Itinerary' },
            { id: 'budget', icon: PieChart, label: 'Budget' },
            { id: 'ai', icon: Sparkles, label: 'AI Planner' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20'
                : 'text-gray-500 hover:bg-[#0a0a0f]'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {trip.itinerary.map((day) => (
                <div key={day.dayNumber} className="relative pl-8 md:pl-0">
                  {/* Timeline Line (Desktop) */}
                  <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

                  <div className="bg-white/5 rounded-2xl border border-white/5 shadow-none overflow-hidden group">
                    <div className="bg-[#0a0a0f]/50 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-teal-500/100 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-teal-500/10 relative z-10">
                          <span className="text-xs font-bold uppercase opacity-80">Day</span>
                          <span className="text-2xl font-extrabold">{day.dayNumber}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-100 text-lg">
                            {new Date(new Date(trip.startDate).setDate(new Date(trip.startDate).getDate() + day.dayNumber - 1)).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </h3>
                          <p className="text-gray-500 text-sm">{day.activities.length} Activities Planned</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedDay(day.dayNumber); setIsModalOpen(true); }}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 hover:bg-teal-500/10 hover:border-blue-200 transition-all shadow-none"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6">
                      {day.activities.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl bg-[#0a0a0f]/50">
                          <p className="text-gray-600 font-medium mb-2">No activities yet</p>
                          <button
                            onClick={() => { setSelectedDay(day.dayNumber); setIsModalOpen(true); }}
                            className="text-teal-400 text-sm font-bold hover:underline"
                          >
                            Add your first activity
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {day.activities.map((act) => (
                            <div key={act.id} className="group/activity flex gap-4 p-4 rounded-xl bg-[#0a0a0f] hover:bg-white/5 hover:shadow-md transition-all border border-transparent hover:border-white/5">
                              <div className="min-w-[4rem] text-center pt-1">
                                <div className="text-sm font-bold text-gray-300">{act.time}</div>
                                <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                                  {/^\d{1,2}:\d{2}$/.test(act.time)
                                    ? (Number(act.time.split(':')[0]) >= 12 ? 'PM' : 'AM')
                                    : ''}
                                </div>
                              </div>
                              <div className="h-auto w-0.5 bg-white/10/50 my-1"></div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-gray-100 text-lg">{act.location}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200">
                                      ${act.cost}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteActivity(day.dayNumber, act.id)}
                                      className="opacity-0 group-hover/activity:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-400 border border-red-100"
                                      title="Remove activity"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">{act.notes}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white/5 p-8 rounded-3xl shadow-none border border-white/5 flex flex-col justify-center items-center text-center">
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" className="stroke-slate-100 fill-none" strokeWidth="12" />
                    <circle
                      cx="96" cy="96" r="88"
                      className={`${budgetProgress > 100 ? 'stroke-red-500' : 'stroke-blue-600'} fill-none transition-all duration-1000 ease-out`}
                      strokeWidth="12"
                      strokeDasharray={553}
                      strokeDashoffset={553 - (553 * Math.min(budgetProgress, 100)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-100">${totalSpent}</span>
                    <span className="text-gray-600 text-sm font-medium">Spent of ${trip.budget.total}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">Total Budget Status</h3>
                <p className={`text-sm font-medium ${budgetProgress > 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {budgetProgress > 100 ? 'Over Budget by' : 'Remaining Budget:'} ${Math.abs(trip.budget.total - totalSpent)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-3xl shadow-none border border-white/5">
                  <h3 className="font-bold text-gray-100 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-400" /> Expense Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#0a0a0f] rounded-2xl">
                      <span className="text-gray-400 font-medium">Activities</span>
                      <span className="font-bold text-white">${trip.budget.spent}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0a0a0f] rounded-2xl opacity-80">
                      <span className="text-gray-400 font-medium">Accommodation (Est.)</span>
                      <span className="font-bold text-white">${trip.budget.estimatedAccommodation || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0a0a0f] rounded-2xl opacity-80">
                      <span className="text-gray-400 font-medium">Transport (Est.)</span>
                      <span className="font-bold text-white">${trip.budget.estimatedTransport || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-teal-900 to-blue-900 rounded-[2rem] p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                    <Sparkles className="w-8 h-8 text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-4">Let AI Plan Your Days</h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    Our advanced AI analyzes your destination and budget to suggest the perfect activities for your {daysDiff}-day trip.
                  </p>
                  <button
                    onClick={generateAI}
                    disabled={aiLoading}
                    className="bg-teal-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-teal-400 hover:scale-105 transition-all shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                  >
                    {aiLoading ? (
                      <>Generating... <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /></>
                    ) : (
                      <>Generate Suggestions <Sparkles className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>

              {aiSuggestions && (
                <div className="space-y-8 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-100 text-center mb-6">Recommended for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiSuggestions.activities.map((act, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-none hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Day {act.day}
                          </span>
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-sm border border-emerald-100">
                            ${act.cost}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-teal-400 transition-colors">{act.location}</h4>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{act.notes}</p>
                        <button
                          onClick={() => handleAddAiActivity(act, act.day)}
                          className="w-full py-3 rounded-xl border-2 border-white/5 font-bold text-gray-400 hover:border-blue-600 hover:bg-teal-500/100 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add to Itinerary
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Add Activity Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-[#0a0a0f] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-100">Add Activity to Day {selectedDay}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleManualAdd} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                      <input
                        type="time"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-300"
                        value={newActivity.time}
                        onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cost</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-300"
                        value={newActivity.cost}
                        onChange={e => setNewActivity({ ...newActivity, cost: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location/Activity</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Louvre Museum"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-300"
                      value={newActivity.location}
                      onChange={e => setNewActivity({ ...newActivity, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Add any details, booking numbers, or reminders..."
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-400 resize-none"
                    value={newActivity.notes}
                    onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
                >
                  Add Activity
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3 font-bold border border-white/10 backdrop-blur-md">
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold">Success!</p>
                <p className="text-xs text-white/90 font-medium">Activity added to your itinerary.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TripDetails;



