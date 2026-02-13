
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Plane, Globe } from 'lucide-react';
import AuthContext from '../context/AuthContext';


const Login = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
      } catch (err) {
        console.error(err);
        setError('Google login failed. Please try again.');
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
      setIsLoading(false);
    },
  });

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      googleLoginHandler();
    } else {
      alert(`${provider} login is coming soon!`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0a0a0f] overscroll-none">

      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden text-white bg-gray-950">
        <div className="absolute inset-0">
          <img
            src="/login.jpg"
            alt="Travel adventure"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-slate-900/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">


          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Welcome <br />
              <span className="text-teal-400">Back</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Continue your journey. Access your saved itineraries and explore new destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white/5">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-bl-full opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-tr-full opacity-50 -z-10" />

        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-block p-3 rounded-2xl bg-teal-500/10 text-teal-600 mb-4 lg:hidden">
              <Globe className="w-8 h-8" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Log In
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-lg">
              Welcome back to your adventure planner.
            </motion.p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-none group-hover:bg-white/5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-gray-300">Password</label>
                <a href="#" className="text-sm font-semibold text-teal-400 hover:text-teal-300">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-none group-hover:bg-white/5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Log In <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/5 text-gray-600 bg-white/5">Or log in with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/5 rounded-xl hover:bg-[#0a0a0f] transition-colors font-semibold text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/5 rounded-xl hover:bg-[#0a0a0f] transition-colors font-semibold text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-12 text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all">
              Sign up here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;


