
import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import ContactUs from './pages/ContactUs';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            <Route
              path="/create-trip"
              element={user ? <CreateTrip /> : <Navigate to="/login" />}
            />

            <Route
              path="/trip/:id"
              element={user ? <TripDetails /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        <footer className="bg-black/60 backdrop-blur-xl border-t border-white/5 py-6 text-center text-white text-sm">
          &copy; {new Date().getFullYear()} TripPlan. Your perfect trip, planned.
        </footer>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
